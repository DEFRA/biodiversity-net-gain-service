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
      queueName: 'ne.bng.combined.inbound',
      message: body
    },
    res: {
      applicationReference: body.combinedCaseRegistration.applicationReference
    }
  }
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    // Generate gain site reference if not already present
    db = await getDBConnection(context)
    if (!req.body.combinedCaseRegistration.applicationReference) {
      const applicationReference = await createApplicationReference(db)
      req.body.combinedCaseRegistration.applicationReference = applicationReference.rows[0].application_reference
      req.body.combinedCaseRegistration.payment.reference = applicationReference.rows[0].application_reference
    } else {
      // Check if application has been submitted and throw error if true
      const status = await getApplicationStatus(db, [req.body.combinedCaseRegistration.applicationReference])
      if (status.rows.length > 0 && status.rows[0].application_status === applicationStatuses.submitted) {
        context.log(`Duplicate submission detected ${req.body.combinedCaseRegistration.applicationReference}`)
        throw new DuplicateApplicationReferenceError(
          req.body.combinedCaseRegistration.applicationReference,
          'Application reference has already been processed'
        )
      }
      // Clear out saved application (reference was generated from saving)
      await deleteApplicationSession(db, [req.body.combinedCaseRegistration.applicationReference])
    }
    // Set status of application to submitted
    await insertApplicationStatus(db, [req.body.combinedCaseRegistration.applicationReference, applicationStatuses.submitted])

    const config = buildConfig(req.body)
    context.bindings.outputSbQueue = config.serviceBusConfig.message
    context.res = {
      status: 200,
      body: JSON.stringify(config.res)
    }
    context.log(`Processed ${req.body.combinedCaseRegistration.applicationReference}`)
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
