import { getDBConnection } from '@defra/bng-utils-lib'
import {
  createApplicationReference,
  deleteApplicationSession,
  getApplicationStatus,
  insertApplicationStatus
} from '../Shared/db-queries.js'
import applicationStatuses from '../Shared/application-statuses.js'
import { DuplicateApplicationReferenceError } from '@defra/bng-errors-lib'

const buildConfig = body => {
  return {
    serviceBusConfig: {
      queueName: 'ne.bng.developer.inbound',
      message: body
    },
    res: {
      allocationReference: body.developerAllocation.allocationReference
    }
  }
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    // Generate gain site reference if not already present
    db = await getDBConnection(context)
    if (!req.body.developerAllocation.allocationReference) {
      const applicationReference = await createApplicationReference(db)
      req.body.developerAllocation.allocationReference = applicationReference.rows[0].application_reference
      req.body.developerAllocation.payment.reference = applicationReference.rows[0].application_reference
    } else {
      // Check if application has been submitted and throw error if true
      const status = await getApplicationStatus(db, [req.body.developerAllocation.allocationReference])
      if (status.rows.length > 0 && status.rows[0].application_status === applicationStatuses.submitted) {
        context.log(`Duplicate submission detected ${req.body.developerAllocation.allocationReference}`)
        throw new DuplicateApplicationReferenceError(
          req.body.developerAllocation.allocationReference,
          'Application reference has already been processed'
        )
      }
      // Clear out saved application (reference was generated from saving)
      await deleteApplicationSession(db, [req.body.developerAllocation.allocationReference])
    }
    // Set status of application to submitted
    await insertApplicationStatus(db, [req.body.developerAllocation.allocationReference, applicationStatuses.submitted])

    const config = buildConfig(req.body)
    context.bindings.outputSbQueue = config.serviceBusConfig.message
    context.res = {
      status: 200,
      body: JSON.stringify(config.res)
    }
    context.log(`Processed ${req.body.developerAllocation.allocationReference}`)
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: err
    }
  } finally {
    await db?.end()
  }
}
