import buildUploadConfigFromMessage from '../Shared/build-upload-config-from-message.js'
import buildSignalRMessage from '../Shared/build-signalr-message.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { screenDocumentForThreats } from '@defra/bng-document-service'
import { ThreatScreeningError } from '@defra/bng-errors-lib'

// TO DO - If replay logic is effective at resolving intermittent threat scanning problems
// with macro enabled spreadsheets, read host.json to determine if a custom maximum number of
// replay attempts is configured.
const maximumNumberOfReplayAttempts = 10

const baseConfig = {
  untrustedBlobStorageConfig: {
    containerName: 'untrusted'
  },
  trustedBlobStorageConfig: {
    containerName: 'trusted'
  },
  avConfig: {
    baseUrl: process.env.AV_API_BASE_URL,
    authenticationConfig: {
      url: process.env.AV_API_TOKEN_URL,
      clientId: process.env.AV_API_CLIENT_ID,
      clientSecret: process.env.AV_API_CLIENT_SECRET,
      scope: process.env.AV_API_SCOPE
    }
  }
}

export default async function (context, message) {
  context.log(`Processing ${JSON.stringify(message)} - Delivery attempt ${context?.bindingData?.dequeueCount}`)
  const config = buildConfig(message)
  // Blob based triggering of Azure functions can be delayed due to its polling based implementation and event grid based
  // blob triggering of Azure functions is in preview.
  // Use Azure storage queues combined with blob storage to ensure responsive processing while event grid based blob triggering
  // is in preview - see https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns.
  //
  // If threat screening succeeds, copy the untrusted file to the trusted file container manually before using a binding to place the trusted file location on a
  // storage queue. This ensures that the file will be present in the trusted file container BEFORE the queued message is processed.

  try {
    const response = await blobStorageConnector.downloadStreamIfExists(context, config.untrustedBlobStorageConfig)

    if (response) {
      const documentStream = response.readableStreamBody
      if (!process.env.AV_DISABLE || !JSON.parse(process.env.AV_DISABLE)) {
        const response = await screenDocument(context, config, documentStream)
        context.log(`Screening reequest submitted ${response.data}`)
      } else {
        // If screening is disabled this function must upload document to trusted blob and send message to queue
        context.log('File security screening is disabled')
        await uploadDocument(config, documentStream)
        message.containerName = baseConfig.trustedBlobStorageConfig.containerName
        sendMessage(context, message)
      }
    } else {
      context.log.error('Unable to retrieve blob')
    }
  } catch (err) {
    context.log.error(err)
    let signalRMessageArguments
    if (err instanceof ThreatScreeningError) {
      signalRMessageArguments = [{ threatScreeningDetails: err.threatScreeningDetails }]
    } else if (context?.bindingData?.dequeueCount < maximumNumberOfReplayAttempts) {
      // Replay the message
      throw err
    } else {
      // The maximum number of message processing attempts has been reached so send a notification to the clienr..
      signalRMessageArguments = [{ errorMessage: err.message }]
    }
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}

const buildConfig = message => {
  const config = JSON.parse(JSON.stringify(baseConfig))
  config.untrustedBlobStorageConfig.blobName = message.location
  config.trustedBlobStorageConfig.blobName = message.location

  config.avConfig.fileConfig = {
    location: message.location
  }

  Object.assign(config, buildUploadConfigFromMessage(message))
  return config
}

const screenDocument = async (context, config, stream) => {
  context.log('Sending file for security screening')
  return screenDocumentForThreats(context, config.avConfig, stream)
}

const uploadDocument = async (config, fileStream) => {
  await blobStorageConnector.uploadStream(config.trustedBlobStorageConfig, fileStream)
}

const sendMessage = (context, message) => {
  context.bindings.trustedFileQueue = message
}
