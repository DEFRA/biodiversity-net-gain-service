import buildSignalRMessage from '../../Shared/build-signalr-message.js'

export default async function (context, config) {
  let signalRMessageArguments
  try {
    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation
    }]
  } catch (err) {
    context.log.error(err)
    signalRMessageArguments = [{ errorCode: err.code }]
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
