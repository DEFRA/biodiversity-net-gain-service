import {
  getApplicationCountByContactIdAndOrganisationId,
  getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType
} from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    const {
      contactId,
      organisationId,
      applicationType
    } = req.body
    if (!contactId || !applicationType) {
      throw new Error('Contact ID or application type is missing')
    }

    db = await getDBConnection(context)

    // Does the user have any applications regardless of application type?
    const applicationCountResult = await getApplicationCountByContactIdAndOrganisationId(db, [contactId, organisationId])

    if (applicationCountResult?.rows[0]?.application_count) {
      const applicationStatusJson = await getApplicationData(db, contactId, organisationId, applicationType)
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

const getApplicationData = async (db, contactId, organisationId, applicationType) => {
  const applicationData = []
  const applicationStatusesResult = await getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType(db, [contactId, organisationId, applicationType])

  for (const row of applicationStatusesResult.rows) {
    applicationData.push({
      applicationReference: row.application_reference,
      lastUpdated: row.date_modified,
      applicationStatus: row.application_status
    })
  }
  return applicationData
}
