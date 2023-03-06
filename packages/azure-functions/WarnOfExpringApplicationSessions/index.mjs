import { getExpiringApplicationSessions } from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

export default async function (context, _timer) {
  let db
  try {
    db = await getDBConnection()
    context.bindings.expiringApplicationSessionNotificationQueue = []
    context.log('Getting application sessions that require warning of expiry')
    const result = await getExpiringApplicationSessions(db)
    for (const row of result?.rows) {
      context.bindings.expiringApplicationSessionNotificationQueue.push({
        id: row.application_session_id,
        notificationType: 'email'
      })
    }
  } finally {
    await db?.end()
  }
}
