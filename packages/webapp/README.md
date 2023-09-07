# Application to register web app

## Prerequisites

### Common dependencies

Prerequisite dependencies used by multiple packages within this repository are documented in [Prerequisites](../../docs/prerequisites.md)

## Installation and running options as standalone application

warning: other service dependencies will be missing, install and run from root of the repository to run whole package of applications

### Environment variables

| name    | description | mandatory |
|---------|-------------|-----------|
| AZURE_STORAGE_ACCOUNT | Microsoft Azure or Azurite storage account name| Y |
| AZURE_STORAGE_ACCESS_KEY | Microsoft Azure or Azurite storage account shared access key | Y |
| ORDNANCE_SURVEY_API_KEY | Key used to access Ordnance Survey APIs | Y |
| ORDNANCE_SURVEY_API_SECRET | Secret used to access Ordnance Survey APIs | Y |
| MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB | Maximum size of a geospatial land boundary upload (in megabytes) | Y |
| SIGNALR_URL | Microsoft Azure SignalR connection URL (see the note below) | Y |  
| SESSION_COOKIE_PASSWORD | Password for the session cookie | N |
| UPLOAD_PROCESSING_TIMEOUT_MILLIS | Upload processing timeout in milliseconds (defaults to 30000) | N |
| AZURE_FUNCTION_APP_URL | API URL for funtion app | Y |
| COOKIE_IS_SECURE | Sets isSecure flag for session cookie, set to true if site is SSL or false if not | N |
| MAX_METRIC_UPLOAD_MB | Maximum size of a biodiversity metric file upload (in megabytes) |
| GOOGLE_TAGMANAGER_ID | Google Tag Manager ID | N |
| NODE_ENV | sets whether environment is development, test or production, assumed production by default if undefined | N |
| MAX_GEOSPATIAL_FILE_UPLOAD_MB | MVP recommendation to change file size limit on geospatial files | Y |
| ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL | Feature flag of geospatial support in the landowner journey | Y |
| ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL | Feature flag for additional email in the developer journey | Y |

#### Setting the SIGNALR_URL environment variable

This environment variable **MUST** be set to the URL used to access the **SignalRNegotiate** API endpoint provided by the [azure-functions](../azure-functions/)
package **minus** the **/negotiate** path element. For example, if the API endpoint is **<http://localhost:7071/api/negotiate>** the environment variable **must** be set to **<http://localhost:7071/api>**. When connecting to the [containerised SignalR emulator](../../docs/containerisation.md#cloud-service-containers) the API endpoint **must** be set to **<http://localhost:8082/api/>**.

If HTTP triggered functions in the [azure-functions](../azure-functions/) package are accessed through an API Gateway, the environment variable **must** reference the API Gateway accordingly.

### Azurite specific environment variables

When connecting to an [Azurite container](../../docs/containerisation.md/#azure-storage) the following additional environment variables **must** be specified.
| name    | description |
| AZURE_BLOB_SERVICE_URL | URL used to access the Azurite blob service |
| AZURE_QUEUE_SERVICE_URL | URL used to access the Azurite queue service |

### to run locally

Install and build the application

`npm i`

Run the application

`npm run local:start`

### to run in a docker container

To build and start the container

```bash
npm run docker:build
npm run docker:start
```

To stop and clear the container

```bash
npm run docker:stop
```

#### Testing

Tests require execution from the root of the mono-repository
