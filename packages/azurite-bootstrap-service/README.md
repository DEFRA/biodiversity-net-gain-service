# Azurite bootstrap service

A service for creating Biodiversity Net Gain Service Azure storage infrastructure within an [Azurite](https://hub.docker.com/_/microsoft-azure-storage-azurite) instance.

## Environment variables

| name    | description | mandatory |
|---------|-------------|-----------|
| AZURITE_HOST | Azurite host (defaults to localhost) | N |
| AZURITE_BLOB_PORT | Azurite blob service port (defaults to 10000) | N |
| AZURITE_QUEUE_PORT | Azurite queue service port (defaults to 10001) | N |
| AZURITE_STORAGE_ACCOUNT | Azurite storage account name (defaults to devstoreaccount1 | N |
| AZURE_STORAGE_ACCESS_KEY | Azurite storage account shared access key (defaults to the well known key for devstoreaccount1) | N |
