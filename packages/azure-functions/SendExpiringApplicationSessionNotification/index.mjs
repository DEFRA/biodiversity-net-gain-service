import processApplicationSessionNotificationMessage from '../Shared/process-application-session-notification-message.js'
import { recordExpiringApplicationSessionNotification } from '../Shared/db-queries.js'
import getDBConnection from '../Shared/get-db-connection.js'

const templateIds = {
  email: process.env.EXPIRING_APPLICATION_SESSION_TEMPLATE_ID
}

export default async function (context, message) {
  const messageAsString = JSON.stringify(message)
  context.log('Processing', messageAsString)
  await processApplicationSessionNotificationMessage(context, { message, templateIds })
  await recordApplicationSessionExpiryNotification(message.id)
  context.log('Attempted to send expiring application session notification for ', messageAsString)
}

const recordApplicationSessionExpiryNotification = async applicationSessionId => {
  let db
  try {
    db = await getDBConnection()
    await recordExpiringApplicationSessionNotification(db, [applicationSessionId])
  } finally {
    await db?.end()
  }
}
