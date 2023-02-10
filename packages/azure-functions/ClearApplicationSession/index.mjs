import { clearApplicationSession } from '../Shared/db-queries.js'
import getDBConnection from '../Shared/get-db-connection.js'

export default async function (_context, _req) {
  const db = await getDBConnection()
  await clearApplicationSession(db)
  await db.end()
}
