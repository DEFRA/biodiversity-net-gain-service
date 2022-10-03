import { serviceBusConnector } from '@defra/bng-connectors-lib'
import moment from 'moment'
serviceBusConnector.init(process.env.OPERATOR_SB_CONNECTION_STRING)
/*
  Steps for processing an application:
    - Generate unique site reference (currently using session ID) BNGP-778
    - Forward message to integration service bus queue
    - Return response with reference
*/
const buildConfig = body => {
  return {
    serviceBusConfig: {
      queueName: 'ne.bng.landowner.inbound',
      message: body
    },
    res: {
      gainSiteReference: body.landownerGainSiteRegistration.gainSiteReference
    }
  }
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  try {
    // Generate gain site reference
    req.body.landownerGainSiteRegistration.gainSiteReference = `BNG-${moment().utc().format('YYYYMMDDHHmmss')}`
    const config = buildConfig(req.body)
    await serviceBusConnector.sendMessage(config.serviceBusConfig)
    context.res = {
      status: 200,
      body: JSON.stringify(config.res)
    }
  } catch (err) {
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  }
}
