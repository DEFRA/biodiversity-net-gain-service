import processApplicationSessionNotificationMessage from '../Shared/process-application-session-notification-message.js'

const templateIds = {
  email: process.env.SAVED_APPLICATION_SESSION_TEMPLATE_ID
}

export default async function (context, message) {
  const messageAsString = JSON.stringify(message)
  context.log('Processing', messageAsString)
  await processApplicationSessionNotificationMessage(context, { message, templateIds })
  context.log('Attempted to send saved application session notification for ', messageAsString)
}
