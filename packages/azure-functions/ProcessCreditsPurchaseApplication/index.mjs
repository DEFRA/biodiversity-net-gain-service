import { getDBConnection } from '@defra/bng-utils-lib'
import {
  createCreditsAppReference,
  deleteApplicationSession,
  getApplicationStatus,
  insertApplicationStatus
} from '../Shared/db-queries.js'
import applicationStatuses from '../Shared/application-statuses.js'
import { DuplicateApplicationReferenceError } from '@defra/bng-errors-lib'

const buildConfig = body => {
  return {
    serviceBusConfig: {
      queueName: 'ne.bng.credits-purchase.inbound',
      message: body
    },
    res: {
      gainSiteReference: body.creditsPurchase.gainSiteReference
    }
  }
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    // Generate gain site reference if not already present
    db = await getDBConnection(context)
    if (!req.body.creditsPurchase.gainSiteReference) {
      const applicationReference = await createCreditsAppReference(db, [
        req.body.creditsPurchase.applicant?.contactId,
        'CreditsPurchase'
      ])
      req.body.creditsPurchase.gainSiteReference = applicationReference.rows[0].fn_create_credits_app_reference
    } else {
      // Check if application has been submitted and throw error if true
      const status = await getApplicationStatus(db, [req.body.creditsPurchase.gainSiteReference])
      if (status.rows.length > 0 && status.rows[0].application_status === applicationStatuses.submitted) {
        context.log(`Duplicate submission detected ${req.body.creditsPurchase.gainSiteReference}`)
        throw new DuplicateApplicationReferenceError(
          req.body.creditsPurchase.gainSiteReference,
          'Application reference has already been processed'
        )
      }
      // Clear out saved application (reference was generated from saving)
      await deleteApplicationSession(db, [req.body.creditsPurchase.gainSiteReference])
    }
    // Set status of application to submitted
    await insertApplicationStatus(db, [req.body.creditsPurchase.gainSiteReference, applicationStatuses.submitted])

    const config = buildConfig(req.body)
    context.bindings.outputSbQueue = config.serviceBusConfig.message
    context.res = {
      status: 200,
      body: JSON.stringify(config.res)
    }
    context.log(`Processed ${req.body.creditsPurchase.gainSiteReference}`)
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