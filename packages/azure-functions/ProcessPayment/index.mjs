import {
  insertApplicationPayment
} from '../Shared/db-queries.js'
import { getDBConnection } from '@defra/bng-utils-lib'

const buildConfig = body => {
  return {
    serviceBusConfig: {
      queueName: 'ne.bng.payment.inbound',
      message: {
        landownerGainSiteRegistration: body.landownerGainSiteRegistration
      }
    },
    res: {
      gainSiteReference: body.landownerGainSiteRegistration.gainSiteReference
    }
  }
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    db = await getDBConnection(context)
    // record application payment
    await insertApplicationPayment(db, [
      req.body.landownerGainSiteRegistration.gainSiteReference,
      req.body.payment_reference,
      req.body.payment_status,
      req.body.payment_amount
    ])

    const config = buildConfig(req.body)
    context.bindings.outputSbQueue = config.serviceBusConfig.message
    context.res = {
      status: 200,
      body: JSON.stringify(config.res)
    }
    context.log(`Processed ${req.body.landownerGainSiteRegistration.gainSiteReference}`)
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
