import applicationSessionKeys from './application-session-keys.js'
import { getApplicationSessionById } from './db-queries.js'
import getDBConnection from './get-db-connection.js'
import { UnknownApplicationSessionIdError } from '@defra/bng-errors-lib'
import sendEmail from './send-email.js'

export default async function (context, config) {
  const applicationSessionId = config?.message?.id
  const notificationType = config?.message?.notificationType

  try {
    if (applicationSessionId && notificationType) {
      await sendNotificationForApplicationSession(context, config)
    } else {
      context.log.warn(`Ignoring unexpected message ${JSON.stringify(config.message)}`)
    }
  } catch (err) {
    if (err instanceof UnknownApplicationSessionIdError) {
      context.log.warn(`Ignoring message for unknown application session ID ${applicationSessionId}`)
    } else {
      throw err
    }
  }
}

const getApplicationSession = async (_context, applicationSessionId) => {
  const db = await getDBConnection()
  // Get the application session from database
  const result = await getApplicationSessionById(db, [applicationSessionId])
  try {
    if (result?.rows[0]?.application_session) {
      return result.rows[0].application_session
    } else {
      throw new UnknownApplicationSessionIdError(applicationSessionId)
    }
  } finally {
    await db?.end()
  }
}

const sendNotificationForApplicationSession = async (context, config) => {
  if (config.message.notificationType === 'email') {
    await sendEmailForApplicationSession(context, config)
  } else {
    context.log.warn(`Ignoring message due to unsupported notification type ${JSON.stringify(config.message)}`)
  }
}
const sendEmailForApplicationSession = async (context, config) => {
  const applicationSession = await getApplicationSession(context, config.message.id)
  const emailConfig = {
    templateId: config.templateIds.email,
    emailAddress: applicationSession[applicationSessionKeys.emailaddress],
    reference: applicationSession[applicationSessionKeys.applicationReference],
    personalisation: {
      full_name: applicationSession[applicationSessionKeys.fullName],
      reg_number: applicationSession[applicationSessionKeys.applicationReference],
      continue_registration: process.env.CONTINUE_REGISTRATION_URL
    }
  }
  return sendEmail(emailConfig)
}
