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
    const cacheKeys = {
      contactId: 'contact-id',
      applicationType: 'application-type',
      organisationId: 'organisation-id'
    }
    if (!applicationSession[cacheKeys.contactId] || !applicationSession[cacheKeys.applicationType]) {
      throw new Error(`Missing required session data: ${!applicationSession[cacheKeys.contactId] ? 'Contact ID' : 'Application type'} missing from request`)
    }
    db = await getDBConnection(context)

    const isCreditsPurchase = applicationSession[cacheKeys.applicationType].toLowerCase() === 'creditspurchase'
    const params = [
      applicationSession[cacheKeys.contactId],
      applicationSession[cacheKeys.applicationType],
      applicationSession[cacheKeys.organisationId]
    ]
    const createApplicationRefFunction = isCreditsPurchase ? createCreditsAppReference : createApplicationReference

    const setApplicationReference = (applicationType) => {
      const referenceMap = {
        registration: 'application-reference',
        allocation: 'developer-app-reference',
        creditspurchase: 'credits-purchase-application-reference'
      }
      return referenceMap[applicationType.toLowerCase()] || cacheKeys.applicationReference
    }
    // Ensure the application reference keys stay up to date with webapp constants file.
    cacheKeys.applicationReference = setApplicationReference(applicationSession[cacheKeys.applicationType])
    context.log('Processing', JSON.stringify(applicationSession[cacheKeys.applicationReference]))
    const sessionProjectName = applicationSession['credits-purchase-metric-data']?.startPage?.projectName
    // Generate gain site reference if not already present
    if (!applicationSession[cacheKeys.applicationReference]) {
      const result = await createApplicationRefFunction(db, params)
      applicationSession[cacheKeys.applicationReference] = result.rows[0].application_reference

      context.log('Created', JSON.stringify(applicationSession[cacheKeys.applicationReference]))
    }
    if (isCreditsPurchase) {
      await updateProjectName(db, [applicationSession[cacheKeys.applicationReference], sessionProjectName])
    }

    // Save the applicationSession to database
    const savedApplicationSessionResult =
      await saveApplicationSession(db, [
        applicationSession[cacheKeys.applicationReference],
        JSON.stringify(applicationSession)
      ])

    const savedApplicationSessionPrimaryKey = savedApplicationSessionResult.rows[0].application_session_id

    if (process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED && JSON.parse(process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED)) {
      sendNotification(context, savedApplicationSessionPrimaryKey)
    }

    // Return application reference
    context.res = {
      status: 200,
      body: JSON.stringify(applicationSession[cacheKeys.applicationReference])
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
