// TO DO - Add file sanitisation to this function.
import { blobStorageConnector } from '@defra/bng-connectors-lib'

export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  context.log.warn('Transferring untrusted file to trusted container WITHOUT SANITISATION')
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
    const config = {
      blobName: message.location,
      containerName: 'trusted'
    }
    await blobStorageConnector.uploadStream(config, response.readableStreamBody)
    context.bindings.trustedFileQueue = message
  } else {
    context.log('Blob does not exist')
  }
}
