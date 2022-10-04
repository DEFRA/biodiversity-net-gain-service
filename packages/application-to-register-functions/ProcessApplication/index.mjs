// import { serviceBusConnector } from '@defra/bng-connectors-lib'
import moment from 'moment'
// import { ServiceBusClient } from '@azure/service-bus'
// serviceBusConnector.init(process.env.OPERATOR_SB_CONNECTION_STRING)
// console.log(process.env.OPERATOR_SB_CONNECTION_STRING)
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
    context.bindings.outputSbQueue = config.serviceBusConfig.message
    context.res = {
      status: 200,
      body: JSON.stringify(config.res)
    }
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  }
}
