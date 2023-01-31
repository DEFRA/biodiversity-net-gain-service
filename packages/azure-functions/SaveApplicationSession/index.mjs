import { createApplicationReference, saveApplicationSession } from '../Shared/db-queries.js'
import getDBConnection from '../Shared/get-db-connection.js'

// Ensure these stay up to date with webapp constants file.
const redisKeys = {
  applicationReference: 'application-reference',
  emailaddress: 'email-value'
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  try {
    const applicationSession = req.body
    if (!applicationSession[redisKeys.emailaddress]) {
      throw new Error('Email missing from request')
    }
    const db = await getDBConnection()

    // Generate gain site reference if not already present
    if (!applicationSession[redisKeys.applicationReference]) {
      const result = await createApplicationReference(db)
      applicationSession[redisKeys.applicationReference] = result.rows[0].fn_create_application_reference
    }

    // Save the applicationSession to database
    await saveApplicationSession(db, [applicationSession[redisKeys.applicationReference], applicationSession[redisKeys.emailaddress].toLowerCase(), JSON.stringify(applicationSession)])
    await db.end()

    // Return application reference
    context.res = {
      status: 200,
      body: JSON.stringify(applicationSession[redisKeys.applicationReference])
    }
    context.log(`Saved application session ${applicationSession[redisKeys.applicationReference]}`)
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  }
}
