// TO DO - Add security processing to this function.
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  context.log.warn('Transferring untrusted file to trusted container WITHOUT SECURITY PROCESSING')
  // Blob based triggering of Azure functions can be delayed due to its polling based implementation and event grid based
  // blob triggering of Azure functions is in preview.
  // Use Azure storage queues combined with blob storage to ensure responsive processing while event grid based blob triggering
  // is in preview - see https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns.
  //
  // Copy the untrusted file to the trusted file container manually before using a binding to place the trusted file location on a
  // storage queue. This ensures that the file will be present in the trusted file container BEFORE the queued message is processed.

  const config = {
    blobName: message.location,
    containerName: 'untrusted'
  }
  const response = await blobStorageConnector.downloadStreamIfExists(context, config)

  if (response) {
    const blobConfig = {
      blobName: message.location,
      containerName: 'trusted'
    }
    await blobStorageConnector.uploadStream(blobConfig, response.readableStreamBody)
    if (response.metadata && response.metadata.noprocess && JSON.parse(response.metadata.noprocess)) {
      context.bindings.signalRMessages = [{
        userId: message.location.substring(0, message.location.indexOf('/')),
        target: `Processed ${path.parse(config.blobName).base}`,
        arguments: [{
          location: config.blobName
        }]
      }]
    } else {
      context.bindings.trustedFileQueue = message
    }
  } else {
    context.log('Blob does not exist')
  }
}
