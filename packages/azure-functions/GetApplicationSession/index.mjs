import { getApplicationSessionByReferenceContactIdAndApplicationType } from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    const applicationReference = req.body.applicationReference
    const contactId = req.body.contactId
    const applicationType = req.body.applicationType
    let body
    if (!applicationReference || !contactId || !applicationType) {
      throw new Error('Contact ID, application type or application reference is missing')
    }

    db = await getDBConnection(context)

    // Get the application session from database
    const applicationSession = await getApplicationSessionByReferenceContactIdAndApplicationType(db, [applicationReference, contactId, applicationType], context)

    // Check if we have an application session to return
    if (applicationSession.rows[0]) {
      body = JSON.stringify(applicationSession.rows[0].application_session)
      context.log(`Got application session for ${applicationReference}`)
    } else {
      body = JSON.stringify({})
      context.log(`No application data found for ${applicationReference}`)
    }

    // Return application reference
    context.res = {
      status: 200,
      body
    }
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  } finally {
    await db?.end(context)
  }
}
