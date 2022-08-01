import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { screenDocumentForThreats } from '@defra/bng-document-service'

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
  context.log('Processing', JSON.stringify(message))
  const config = JSON.parse(JSON.stringify(baseConfig))
  config.untrustedBlobStorageConfig.blobName = message.location
  config.trustedBlobStorageConfig.blobName = message.location

  config.avConfig.fileConfig = {
    location: message.location
  }

  // Blob based triggering of Azure functions can be delayed due to its polling based implementation and event grid based
  // blob triggering of Azure functions is in preview.
  // Use Azure storage queues combined with blob storage to ensure responsive processing while event grid based blob triggering
  // is in preview - see https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns.
  //
  // If threat screening succeeds, copy the untrusted file to the trusted file container manually before using a binding to place the trusted file location on a
  // storage queue. This ensures that the file will be present in the trusted file container BEFORE the queued message is processed.

  let screenedFileAsStream
  const response = await blobStorageConnector.downloadStreamIfExists(context, config.untrustedBlobStorageConfig)

  if (response) {
    context.log('Sending file for security screening')
    try {
      // Interaction with the initial streaming based threat processing solution results in a stream being returned
      // for upload to the trusted file container. At present, a stream is submitted for threat processing and then polling
      // is used to retrieve the results.
      //
      // If asynchronous interaction with the threat processing solution is progressed, it will be benefical if:
      // - this function submits a stream for threat processing.
      // - the threat processing solution notifies another function when threat processing is complete
      //   (either successfully or unsuccessfully).
      //
      // Synchronous threat processing is also an option for consideration.
      screenedFileAsStream = await screenDocumentForThreats(context, config.avConfig, response.readableStreamBody)
    } catch (err) {
      context.log.error('Unable to screen file')
    }
    if (screenedFileAsStream) {
      await blobStorageConnector.uploadStream(config.trustedBlobStorageConfig, screenedFileAsStream)
      context.bindings.trustedFileQueue = message
    }
  } else {
    context.log.error('Unable to retrieve blob')
  }
}
