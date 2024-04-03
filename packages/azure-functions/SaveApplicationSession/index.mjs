import {
  createApplicationReference,
  createCreditsAppReference,
  saveApplicationSession
} from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

// Ensure these stay up to date with webapp constants file.
const cacheKeys = {
  contactId: 'contact-id',
  applicationType: 'application-type',
  organisationId: 'organisation-id'
}

export default async function (context, req) {
  let db
  try {
    const applicationSession = req.body
    if (!applicationSession[cacheKeys.contactId]) {
      throw new Error('Contact ID missing from request')
    } else if (!applicationSession[cacheKeys.applicationType]) {
      throw new Error('Application type missing from request')
    }

    db = await getDBConnection(context)

    // Ensure the application reference keys stay up to date with webapp constants file.
    if (applicationSession[cacheKeys.applicationType] === 'Registration') {
      cacheKeys.applicationReference = 'application-reference'
    }

    if (applicationSession[cacheKeys.applicationType] === 'Allocation') {
      cacheKeys.applicationReference = 'developer-app-reference'
    }

    if (applicationSession[cacheKeys.applicationType] === 'CreditsPurchase') {
      cacheKeys.applicationReference = 'credits-purchase-application-reference'
    }

    context.log('Processing', JSON.stringify(applicationSession[cacheKeys.applicationReference]))

    // Generate gain site reference if not already present
    if (!applicationSession[cacheKeys.applicationReference]) {
      let createApplicationRefFunction = createApplicationReference

      if (applicationSession[cacheKeys.applicationType] === 'CreditsPurchase') {
        createApplicationRefFunction = createCreditsAppReference
      }

      const result = await createApplicationRefFunction(db, [
        applicationSession[cacheKeys.contactId],
        applicationSession[cacheKeys.applicationType],
        applicationSession[cacheKeys.organisationId]
      ])

      applicationSession[cacheKeys.applicationReference] = applicationSession[cacheKeys.applicationType] === 'CreditsPurchase'
        ? result.rows[0].fn_create_credits_app_reference
        : result.rows[0].fn_create_application_reference

      context.log('Created', JSON.stringify(applicationSession[cacheKeys.applicationReference]))
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
