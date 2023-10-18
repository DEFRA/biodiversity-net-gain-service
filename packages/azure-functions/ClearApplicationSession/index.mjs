import { clearApplicationSession } from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

export default async function (context, _timer) {
  let db
  try {
    db = await getDBConnection()
    context.log('Clearing expired application sessions')
    await clearApplicationSession(db)
  } finally {
    await db?.end()
  }
}
