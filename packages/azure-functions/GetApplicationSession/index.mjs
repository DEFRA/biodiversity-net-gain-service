import { getApplicationSession } from '../Shared/db-queries.js'
import getDBConnection from '../Shared/get-db-connection.js'

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  try {
    const applicationReference = req.body.applicationReference
    const email = req.body.email
    let body
    if (!applicationReference || !email) {
      throw new Error('Email or application reference is missing')
    }

    const db = await getDBConnection()

    // Get the application session from database
    const applicationSession = await getApplicationSession(db, [applicationReference, email])

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
  }
}
