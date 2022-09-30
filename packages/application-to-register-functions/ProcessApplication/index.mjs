import buildSignalRMessage from '../Shared/build-signalr-message.js'
import { serviceBusConnector } from '@defra/bng-connectors-lib'
serviceBusConnector.init(process.env.OPERATOR_SB_CONNECTION_STRING)
/*
  Steps for processing an application:
    - Generate unique site reference (currently using session ID) BNGP-778
    - Forward message to integration service bus queue
    - Return signalR message to front end, or error.
*/
const buildConfig = (message) => {
  return {
    serviceBusConfig: {
      queueName: 'ne.bng.landowner.inbound',
      message: message.landownerGainSiteRegistration
    },
    signalRMessageConfig: {
      userId: message.userId,
      target: `Processed ${message.userId}`
    }
  }
}

export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  const config = buildConfig(message)
  await serviceBusConnector.sendMessage(config.serviceBusConfig)
  context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, [{ gainSiteReference: message.userId }])]
}
