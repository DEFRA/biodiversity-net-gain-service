import { createApplicationReference, saveApplicationSession } from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

// Ensure these stay up to date with webapp constants file.
const redisKeys = {
  contactId: 'contact-id',
  applicationType: 'application-type'
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    const applicationSession = req.body
    if (!applicationSession[redisKeys.contactId]) {
      throw new Error('Contact ID missing from request')
    } else if (!applicationSession[redisKeys.applicationType]) {
      throw new Error('Application type missing from request')
    }

    db = await getDBConnection()

    // Ensure the application reference keys stay up to date with webapp constants file.
    redisKeys.applicationReference =
      applicationSession[redisKeys.applicationType] === 'Registration' ? 'application-reference' : 'developer-app-reference'

    // Generate gain site reference if not already present
    if (!applicationSession[redisKeys.applicationReference]) {
      const result = await createApplicationReference(db, [
        applicationSession[redisKeys.contactId],
        applicationSession[redisKeys.applicationType]
      ])
      applicationSession[redisKeys.applicationReference] = result.rows[0].fn_create_application_reference
    }

    // Save the applicationSession to database
    const savedApplicationSessionResult =
      await saveApplicationSession(db, [
        applicationSession[redisKeys.applicationReference],
        JSON.stringify(applicationSession)
      ])

    const savedApplicationSessionPrimaryKey = savedApplicationSessionResult.rows[0].application_session_id

    if (process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED) {
      sendNotification(context, savedApplicationSessionPrimaryKey)
    }

    // Return application reference
    context.res = {
      status: 200,
      body: JSON.stringify(applicationSession[redisKeys.applicationReference])
    }
    context.log(`Saved application session ${applicationSession[redisKeys.applicationReference]}`)
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
