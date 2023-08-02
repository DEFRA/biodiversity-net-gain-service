import buildUploadConfigFromMessage from '../Shared/build-upload-config-from-message.js'
import buildSignalRMessage from '../Shared/build-signalr-message.js'

const postFix = process.env.AV_COLLECTION_POSTFIX

export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  const config = buildUploadConfigFromMessage(message)
  let processingFunction
  try {
    // Load the processing function for the upload type.
    const helper = postFix ? `${message.uploadType.replace('-' + postFix, '')}` : `${message.uploadType}`
    processingFunction = (await import(`./helpers/process-${helper}.js`)).default
    await processingFunction(context, config)
  } catch (err) {
    // If the processing function cannot be loaded message replay should not be attempted.
    context.log.error(`Unable to load processing function for upload type ${JSON.stringify(message)}.uploadType - ${err.message}`)
    context.log.error(err)
    const signalRMessageArguments = [{
      code: 'UNKNOWN-UPLOAD-TYPE',
      uploadType: message.uploadType
    }]

    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
