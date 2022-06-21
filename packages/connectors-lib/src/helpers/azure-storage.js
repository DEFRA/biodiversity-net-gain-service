import { BlobServiceClient, StorageSharedKeyCredential as BlobStorageSharedKeyCredential } from '@azure/storage-blob'
import { QueueServiceClient, StorageSharedKeyCredential as QueueStorageSharedKeyCredential } from '@azure/storage-queue'

const azureStorageAccountName = process.env.AZURE_STORAGE_ACCOUNT
const azureBlobStorageUrl = process.env.AZURE_BLOB_SERVICE_URL || `https://${azureStorageAccountName}.blob.core.windows.net`
const azureQueueStorageUrl = process.env.AZURE_QUEUE_SERVICE_URL || `https://${azureStorageAccountName}.queue.core.windows.net`

const getCredential = StorageSharedKeyCredentialConstructorFunction => {
  // TO DO - Switch to DefaultAzureCredential with managed identity.
  const azureStorageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY

  return new StorageSharedKeyCredentialConstructorFunction(
    azureStorageAccountName,
    azureStorageAccessKey
  )
}

const initialiseBlobServiceClient = () => {
  return new BlobServiceClient(
    azureBlobStorageUrl,
    getCredential(BlobStorageSharedKeyCredential)
  )
}

const initialiseQueueServiceClient = () => {
  return new QueueServiceClient(
    azureQueueStorageUrl,
    getCredential(QueueStorageSharedKeyCredential)
  )
}

const blobServiceClient = initialiseBlobServiceClient()

const queueServiceClient = initialiseQueueServiceClient()

const getBlobServiceClient = () => blobServiceClient

const getQueueServiceClient = () => queueServiceClient

export { getBlobServiceClient, getQueueServiceClient }
