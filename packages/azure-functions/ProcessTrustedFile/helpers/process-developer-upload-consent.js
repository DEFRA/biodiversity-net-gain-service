import buildSignalRMessage from '../../Shared/build-signalr-message.js'

const CONSENT_FILE_EXTENSION = ['.doc', '.docx', '.pdf']

export default async function (context, config) {
  let signalRMessageArguments = []

  if (!CONSENT_FILE_EXTENSION.includes(config.fileConfig.fileExtension)) {
    signalRMessageArguments = [{ errorCode: '' }]
  }

  signalRMessageArguments = [{
    location: config.fileConfig.fileLocation
  }]
  context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
}
