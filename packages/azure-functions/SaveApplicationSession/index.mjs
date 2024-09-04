import {
  createApplicationReference,
  createCreditsAppReference,
  saveApplicationSession,
  updateProjectName
} from '../Shared/db-queries.js'

import { getDBConnection } from '@defra/bng-utils-lib'

export default async function (context, req) {
  let db
  try {
    const applicationSession = req.body
    const redisKeys = {
      contactId: 'contact-id',
      applicationType: 'application-type',
      organisationId: 'organisation-id'
    }
    if (!applicationSession[redisKeys.contactId] || !applicationSession[redisKeys.applicationType]) {
      throw new Error(`Missing required session data: ${!applicationSession[redisKeys.contactId] ? 'Contact ID' : 'Application type'} missing from request`)
    }
    db = await getDBConnection(context)

    const isCreditsPurchase = applicationSession[redisKeys.applicationType].toLowerCase() === 'creditspurchase'
    const isRegistration = applicationSession[redisKeys.applicationType].toLowerCase() === 'registration'
    const params = [
      applicationSession[redisKeys.contactId],
      applicationSession[redisKeys.applicationType],
      applicationSession[redisKeys.organisationId]
    ]
    const createApplicationRefFunction = isCreditsPurchase ? createCreditsAppReference : createApplicationReference

    const setApplicationReference = (applicationType) => {
      const referenceMap = {
        registration: 'application-reference',
        allocation: 'developer-app-reference',
        creditspurchase: 'credits-purchase-application-reference',
        combinedcase: 'combined-case-application-reference'
      }
      return referenceMap[applicationType.toLowerCase()] || redisKeys.applicationReference
    }
    // Ensure the application reference keys stay up to date with webapp constants file.
    redisKeys.applicationReference = setApplicationReference(applicationSession[redisKeys.applicationType])
    context.log('Processing', JSON.stringify(applicationSession[redisKeys.applicationReference]))

    // Generate gain site reference if not already present
    if (!applicationSession[redisKeys.applicationReference]) {
      const result = await createApplicationRefFunction(db, params)
      applicationSession[redisKeys.applicationReference] = result.rows[0].application_reference

      context.log('Created', JSON.stringify(applicationSession[redisKeys.applicationReference]))
    }
    if (!isRegistration) {
      const sessionProjectName = isCreditsPurchase
        ? applicationSession['credits-purchase-planning-development-name']
        : applicationSession['developer-planning-development-name']
      await updateProjectName(db, [applicationSession[redisKeys.applicationReference], sessionProjectName])
    }

    // Save the applicationSession to database
    const savedApplicationSessionResult =
      await saveApplicationSession(db, [
        applicationSession[redisKeys.applicationReference],
        JSON.stringify(applicationSession)
      ])

    const savedApplicationSessionPrimaryKey = savedApplicationSessionResult.rows[0].application_session_id

    if (process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED && JSON.parse(process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED)) {
      sendNotification(context, savedApplicationSessionPrimaryKey)
    }

    // Return application reference
    context.res = {
      status: 200,
      body: JSON.stringify(applicationSession[redisKeys.applicationReference])
    }
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  } finally {
    await db?.end()
  }
}

const sendNotification = (context, applicationSessionId) => {
  const message = {
    id: applicationSessionId,
    notificationType: 'email'
  }
  context.bindings.savedApplicationSessionNotificationQueue = message
}
