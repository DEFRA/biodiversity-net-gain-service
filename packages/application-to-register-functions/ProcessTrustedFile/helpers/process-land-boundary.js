import buildSignalRMessage from '../../Shared/build-signalr-message.js'

export default async function (context, config) {
  const signalRMessageArguments = [{
    location: config.fileConfig.fileLocation
  }]
  context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
}
