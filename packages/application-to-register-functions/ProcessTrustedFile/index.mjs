import path from 'path'

export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  const config = buildConfig(message)
  let processingFunction
  try {
    // Load the processing function for the upload type.
    processingFunction = (await import(`./helpers/process-${message.uploadType}.js`)).default
    await processingFunction(context, config)
  } catch (err) {
    // If the processing function cannot be loaded message replay should not be attempted.
    context.log.error(`Unable to load processing function for upload type ${JSON.stringify(message)}.uploadType - ${err.message}`)
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, message.uploadType)]
  }
}

const buildConfig = message => {
  const fileLocation = message.location
  const fileExtension = path.extname(fileLocation)
  const fileDirectory = path.dirname(fileLocation)
  const filename = path.basename(fileLocation, fileExtension)

  return Object.freeze({
    fileConfig: {
      fileLocation,
      fileExtension,
      fileDirectory,
      filename
    },
    signalRMessageConfig: {
      userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
      target: `Processed ${filename}${fileExtension}`
    }
  })
}

const buildSignalRMessage = (signalRMessageConfig, uploadType) => {
  const signalRMessage = Object.assign({}, signalRMessageConfig)
  signalRMessage.arguments = {
    code: 'UNKNOWN-UPLOAD-TYPE',
    uploadType
  }
  return signalRMessage
}
