import processApplicationSessionNotificationMessage from '../Shared/process-application-session-notification-message.js'

const templateIds = {
  email: process.env.SAVED_APPLICATION_SESSION_TEMPLATE_ID
}

export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  await processApplicationSessionNotificationMessage(context, { message, templateIds })
}
