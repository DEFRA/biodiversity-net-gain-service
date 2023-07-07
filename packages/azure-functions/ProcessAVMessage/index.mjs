import buildUploadConfigFromMessage from '../Shared/build-upload-config-from-message.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { ThreatScreeningError } from '@defra/bng-errors-lib'
import buildSignalRMessage from '../Shared/build-signalr-message.js'

const baseConfig = {
  untrustedBlobStorageConfig: {
    containerName: 'untrusted'
  },
  trustedBlobStorageConfig: {
    containerName: 'trusted'
  }
}

export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  const config = buildConfig(message)
  try {
    if (message.Status.toLowerCase() === 'success') {
      const response = await blobStorageConnector.downloadStreamIfExists(context, config.untrustedBlobStorageConfig)
      await uploadDocument(config, response.readableStreamBody)
      sendMessage(context, config.trustedQueueMessage)
    } else {
      // AV scanning has failed, return to client with error response
      context.log(`AV scanning has failed, status: ${message.Status}`)
      throw new ThreatScreeningError(message)
    }
  } catch (err) {
    // send signalr failed scan
    context.log.error(err)
    let signalRMessageArguments
    if (err instanceof ThreatScreeningError) {
      signalRMessageArguments = [{ threatScreeningDetails: err.threatScreeningDetails }]
    } else {
      signalRMessageArguments = [{ errorMessage: err.message }]
    }
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}

const buildConfig = message => {
  const config = JSON.parse(JSON.stringify(baseConfig))
  const location = `${message.Key}/${message.Collection}/${message.Name}.${message.Extension}`
  config.untrustedBlobStorageConfig.blobName = location
  config.trustedBlobStorageConfig.blobName = location
  config.trustedQueueMessage = {
    uploadType: message.Collection,
    containerName: baseConfig.trustedBlobStorageConfig.containerName,
    location
  }
  Object.assign(config, buildUploadConfigFromMessage({ location }))
  return config
}

const uploadDocument = async (config, fileStream) => {
  await blobStorageConnector.uploadStream(config.trustedBlobStorageConfig, fileStream)
}

const sendMessage = (context, message) => {
  context.bindings.trustedFileQueue = message
}
