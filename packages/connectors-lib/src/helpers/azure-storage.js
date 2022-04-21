import { BlobServiceClient, StorageSharedKeyCredential as BlobStorageSharedKeyCredential } from '@azure/storage-blob'
import { QueueServiceClient, StorageSharedKeyCredential as QueueStorageSharedKeyCredential } from '@azure/storage-queue'

const azureStorageAccountName = process.env.AZURE_STORAGE_ACCOUNT

const getCredential = (StorageSharedKeyCredentialConstructorFunction) => {
  // TO DO - Switch to DefaultAzureCredential with managed identity.
  const azureStorageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY

  return new StorageSharedKeyCredentialConstructorFunction(
    azureStorageAccountName,
    azureStorageAccessKey
  )
}

const initialiseBlobServiceClient = () => {
  return new BlobServiceClient(
    `https://${azureStorageAccountName}.blob.core.windows.net`,
    getCredential(BlobStorageSharedKeyCredential)
  )
}

const initialiseQueueServiceClient = () => {
  return new QueueServiceClient(
    `https://${azureStorageAccountName}.queue.core.windows.net`,
    getCredential(QueueStorageSharedKeyCredential)
  )
}

const blobServiceClient = initialiseBlobServiceClient()

const queueServiceClient = initialiseQueueServiceClient()

const getBlobServiceClient = () => {
  return blobServiceClient
}

const getQueueServiceClient = () => {
  return queueServiceClient
}

export { getBlobServiceClient, getQueueServiceClient }
