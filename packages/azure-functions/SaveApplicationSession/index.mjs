import {
  createApplicationReference,
  createCreditsAppReference,
  getProjectNameByApplicationReference,
  updateProjectName,
  saveApplicationSession
} from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

// Ensure these stay up to date with webapp constants file.
const redisKeys = {
  contactId: 'contact-id',
  applicationType: 'application-type',
  organisationId: 'organisation-id'
}
const setApplicationReference = (applicationType) => {
  const referenceMap = {
    registration: 'application-reference',
    allocation: 'developer-app-reference',
    creditspurchase: 'credits-purchase-application-reference'
  }
  return referenceMap[applicationType.toLowerCase()] || redisKeys.applicationReference
}
export default async function (context, req) {
  let db
  try {
    const applicationSession = req.body
    if (!applicationSession[redisKeys.contactId]) {
      throw new Error('Contact ID missing from request')
    } else if (!applicationSession[redisKeys.applicationType]) {
      throw new Error('Application type missing from request')
    }

    db = await getDBConnection(context)

    // Ensure the application reference keys stay up to date with webapp constants file.
    redisKeys.applicationReference = setApplicationReference(applicationSession[redisKeys.applicationType])
    context.log('Processing', JSON.stringify(applicationSession[redisKeys.applicationReference]))
    const sessionProjectName = applicationSession['credits-purchase-metric-data']?.startPage?.projectName
    // Generate gain site reference if not already present
    if (!applicationSession[redisKeys.applicationReference]) {
      let createApplicationRefFunction = createApplicationReference

      if (applicationSession[redisKeys.applicationType] === 'CreditsPurchase') {
        createApplicationRefFunction = createCreditsAppReference
      }
      const result = await createApplicationRefFunction(db, [
        applicationSession[redisKeys.contactId],
        applicationSession[redisKeys.applicationType],
        applicationSession[redisKeys.organisationId],
        sessionProjectName
      ])
      applicationSession[redisKeys.applicationReference] = applicationSession[redisKeys.applicationType] === 'CreditsPurchase'
        ? result.rows[0].fn_create_credits_app_reference
        : result.rows[0].fn_create_application_reference

      context.log('Created', JSON.stringify(applicationSession[redisKeys.applicationReference]))
    }
    if (applicationSession[redisKeys.applicationReference] && applicationSession[redisKeys.applicationType] === 'CreditsPurchase') {
      const applicationReferenceResult = await getProjectNameByApplicationReference(db, [applicationSession[redisKeys.applicationReference]])
      const projectName = applicationReferenceResult.rows[0]?.project_name

      if ((sessionProjectName || projectName) && sessionProjectName !== projectName) {
        await updateProjectName(db, [applicationSession[redisKeys.applicationReference], sessionProjectName])
      }
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
