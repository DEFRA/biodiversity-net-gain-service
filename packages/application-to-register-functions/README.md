# Appplication to register functions

Node.js Microsoft Azure functions associated with procesing an application to the BNG public register.
Microsoft Azure SignalR is used to provide asynchronous notifications associated with function processing to the
[application to register web application](../application-to-register-webapp/).

[Extension bundles](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-register) are used to ensure the function app
uses a compatible set of binding extensions.

## Prerequisites

### Common dependencies

Prerequisite dependencies used by multiple packages within this repository are documented in [Prerequisites](../../docs/prerequisites.md)

### Local development prerequisites

[Azure Function Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)

## Function triggers

* HTTP based triggering is used during Microsoft Azure SignalR client connection negotiation.
* Message based triggering is used when processing uploads used to support an application.

## Message processing

* Messages placed on the **untrusted** queue (see [Prerequisites](../../docs/prerequisites.md)) are procesed by the **ProcessUntrustedFile** function.
* Messages placed on the **trusted** queue (see [Prerequisites](../../docs/prerequisites.md)) are procesed by the **ProcessTrustedFile** function.

## App settings / environment variables for deployment to Microsoft Azure

| name    | description | mandatory |
|---------|-------------|-----------|
| APPINSIGHTS_INSTRUMENTATIONKEY | Instrumentation key controlling if telemetry is sent to the ApplicationInsights service | Y |
| APPLICATIONINSIGHTS_CONNECTION_STRING | ApplicationInsights service connection string used by the function app | Y |
| AZURE_SIGNALR_HUB_NAME | Name of the SignalR hub facilitating communication between the functions and web application | Y |
| AZURE_STORAGE_ACCOUNT | Microsoft Azure storage account name | Y |
| AZURE_STORAGE_ACCESS_KEY | Microsoft Azure storage account shared access key | Y |
| AzureWebJobsStorage | Storage account connection string used by the function app | Y |
| FUNCTIONS_EXTENSION_VERSION | Functions runtime version (**must be ~4**) | Y |
| FUNCTIONS_WORKER_RUNTIME | The language worker runtime to load in the function app (**must be node**) | Y |
| WEBSITE_CONTENTAZUREFILECONNECTIONSTRING | Connection string for storage account where the function app code and configuration are stored in event-driven scaling plans running on Windows | Plan dependent |
| WEBSITE_CONTENTSHARE | The file path to the function app code and configuration in an event-driven scaling plan on Windows | Plan dependent |
| WEBSITE_NODE_DEFAULT_VERSION | Default version of Node.js (**must be ~16**) |

### App settings / environment variables for use with Azurite

When connecting to an [Azurite container](../../docs/containerisation.md/#azure-storage) a [local.settings.json](../../docker/azure-services/local.settings.json) file containing a compatible set of app settings **must** be used. This file:

* excludes all app settings / environment variables providing connecivity to Microsoft Azure services
* includes app settings / environment variables required to provide connecivity between the Azurite container and:

  * Azure Functions
  * [GDAL](https://gdal.org/) software called by Azure Functions
* uses the hostname **azurite** to ensure connectivity to an [Azurite container](../../docs/containerisation.md/#azure-storage) when the Azure Functions runtime is used in a containerised environment
  * When connecting from Azure Functions in a non-containerised local environment, the hostname **azurite** must resolve to the local IP address of the host machine.

To switch between connection to Microsoft Azure infrstructure and an Azurite container, the creation of a symbolic link called **local.settings.json** within the directory containing this file which refererences the required local.settings.json file is recommended.

#### Mandatory Azurite specific app settings /environment variables

| name | description |
|------|-------------|
| AZURE_BLOB_SERVICE_URL | URL used to access the Azurite blob service |
| AZURE_QUEUE_SERVICE_URL | URL used to access the Azurite queue service |
| AZURE_STORAGE_CONNECTION_STRING | Connection string linking GDAL and Azurite |

## Installation

The following activities need to be performed for the functions to run. While the documentation states what activities need to be performed it does not prescribe how the activities should be performed.

* Ensure that all prerequisites exist.
* Configure app settings / environment variables.
* Install node modules.
* To run the functions in a Microsoft Azure environment, deploy the functions to a function app.
* To run the functions in a local environment issue the command **func start** from the directory containing this file.
  * This command requires local installation of Azure Function Core Tools as defined in the **Local prerequisites** section above.
