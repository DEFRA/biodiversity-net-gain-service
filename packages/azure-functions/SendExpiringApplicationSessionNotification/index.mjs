import processApplicationSessionNotificationMessage from '../Shared/process-application-session-notification-message.js'
import { recordExpiringApplicationSessionNotification } from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

const templateIds = {
  email: process.env.EXPIRING_APPLICATION_SESSION_TEMPLATE_ID
}

export default async function (context, message) {
  const messageAsString = JSON.stringify(message)
  context.log('Processing', messageAsString)
  await processApplicationSessionNotificationMessage(context, { message, templateIds })
  await recordApplicationSessionExpiryNotification(message.id, context)
  context.log('Attempted to send expiring application session notification for ', messageAsString)
}

const recordApplicationSessionExpiryNotification = async (applicationSessionId, context) => {
  let db
  try {
    db = await getDBConnection(context)
    await recordExpiringApplicationSessionNotification(db, [applicationSessionId])
  } finally {
    await db?.end()
  }
}
