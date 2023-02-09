import { clearApplicationSession } from '../Shared/db-queries.js'
import getDBConnection from '../Shared/get-db-connection.js'

export default async function (context, _timer) {
  let db
  try {
    const db = await getDBConnection()
    context.log('Clearing expired application sessions')
    await clearApplicationSession(db)
  } finally {
    await db?.end()
  }
}
