import {
  createApplicationReference,
  createCreditsAppReference,
  saveApplicationSession
} from '../Shared/db-queries.js'

import {
  redisKeys,
  setApplicationReference,
  prepareParams,
  checkAndUpdateProjectName
} from '../Shared/application-session-helper.js'

import { getDBConnection } from '@defra/bng-utils-lib'

export default async function (context, req) {
  let db
  try {
    const applicationSession = req.body
    if (!applicationSession[redisKeys.contactId] || !applicationSession[redisKeys.applicationType]) {
      throw new Error(`Missing required session data: ${!applicationSession[redisKeys.contactId] ? 'Contact ID' : 'Application type'} missing from request`)
    }
    db = await getDBConnection(context)
    const isCreditsPurchase = applicationSession[redisKeys.applicationType].toLowerCase() === 'creditspurchase'
    const params = prepareParams(applicationSession, isCreditsPurchase)
    const createApplicationRefFunction = isCreditsPurchase ? createCreditsAppReference : createApplicationReference
    // Ensure the application reference keys stay up to date with webapp constants file.
    redisKeys.applicationReference = setApplicationReference(applicationSession[redisKeys.applicationType])
    context.log('Processing', JSON.stringify(applicationSession[redisKeys.applicationReference]))
    const sessionProjectName = applicationSession['credits-purchase-metric-data']?.startPage?.projectName
    // Generate gain site reference if not already present
    if (!applicationSession[redisKeys.applicationReference]) {
      const result = await createApplicationRefFunction(db, params)
      applicationSession[redisKeys.applicationReference] = applicationSession[redisKeys.applicationType] === 'CreditsPurchase'
        ? result.rows[0].fn_create_credits_app_reference
        : result.rows[0].fn_create_application_reference

      context.log('Created', JSON.stringify(applicationSession[redisKeys.applicationReference]))
    }
    await checkAndUpdateProjectName(db, applicationSession, sessionProjectName)

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
