import { getApplicationCountByContactId, getApplicationStatusesByContactIdAndApplicationType } from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    const contactId = req.body.contactId
    const applicationType = req.body.applicationType
    if (!contactId || !applicationType) {
      throw new Error('Contact ID or application type is missing')
    }

    db = await getDBConnection()

    // Does the user have any applications regardless of application type?
    const applicationCountResult = await getApplicationCountByContactId(db, [contactId])

    if (applicationCountResult?.rows[0]?.application_count) {
      const applicationStatusJson = await getApplicationData(db, contactId, applicationType)
      context.res = {
        status: 200,
        body: applicationStatusJson
      }
    } else {
      // The user has not made any applications yet.
      context.res = {
        status: 200,
        body: []
      }
    }
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  } finally {
    await db?.end()
  }
}

const getApplicationData = async (db, contactId, applicationType) => {
  const applicationData = []
  const applicationStatusesResult = await getApplicationStatusesByContactIdAndApplicationType(db, [contactId, applicationType])

  for (const row of applicationStatusesResult.rows) {
    applicationData.push({
      applicationReference: row.application_reference,
      lastUpdated: row.date_modified,
      applicationStatus: row.application_status
    })
  }
  return applicationData
}
