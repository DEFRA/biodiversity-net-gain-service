# Azure functions

Node.js Microsoft Azure functions for the Biodiversity Net Gain service.

[Extension bundles](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-register) are used to ensure the function app
uses a compatible set of binding extensions.

## Prerequisites

### Common dependencies

Prerequisite dependencies used by multiple packages within this repository are documented in [Prerequisites](../../docs/prerequisites.md)

### Local development prerequisites

[Azure Function Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)

## Function triggers

* HTTP based triggering is used:
  * when starting to submit an application to the Biodiversity Net Gain public register.
* Message based triggering is used when:
  * processing uploads to the service.
  * submitting an application to the Biodiversity Net Gain public register.
  * sending notications to users of the service.
* Timer based triggering is used when:
  * deleting unsubmitted, expired applications to the Biodiversity Net Gain public register.
  * detecting unsubmitted applications to the Biodiversity Net Gain public register that are due to expire sooh.

## Message processing

* Messages placed on the **untrusted-file-queue** queue (see [Prerequisites](../../docs/prerequisites.md)) are processed by the **ProcessUntrustedFile** function.
* Messages placed on the **trusted-file-queue** queue (see [Prerequisites](../../docs/prerequisites.md)) are processed by the **ProcessTrustedFile** function.
* Messages placed on the **saved-application-session-notification-queue*** queue (see [Prerequisites](../../docs/prerequisites.md)) are processed by the **SendSavedApplicationSessionNotification** function.
* Messages placed on the **expiring-application-session-notification-queue** queue (see [Prerequisites](../../docs/prerequisites.md)) are processed by the **SendExpiringApplicationSessionNotification** function.

## App settings / environment variables for deployment to Microsoft Azure

| name    | description | mandatory |
|---------|-------------|-----------|
| APPINSIGHTS_INSTRUMENTATIONKEY | Instrumentation key controlling if telemetry is sent to the ApplicationInsights service | Y |
| APPLICATIONINSIGHTS_CONNECTION_STRING | ApplicationInsights service connection string used by the function app | Y |
| AZURE_STORAGE_ACCOUNT | Microsoft Azure storage account name | Y |
| AZURE_STORAGE_ACCESS_KEY | Microsoft Azure storage account shared access key | Y |
| AzureWebJobsStorage | Storage account connection string | Y |
| FUNCTIONS_EXTENSION_VERSION | Functions runtime version (**must be ~4**) | Y |
| FUNCTIONS_WORKER_RUNTIME | The language worker runtime to load in the function app (**must be node**) | Y |
| WEBSITE_CONTENTAZUREFILECONNECTIONSTRING | Connection string for storage account where the function app code and configuration are stored in event-driven scaling plans running on Windows | Plan dependent |
| WEBSITE_CONTENTSHARE | The file path to the function app code and configuration in an event-driven scaling plan on Windows | Plan dependent |
| WEBSITE_NODE_DEFAULT_VERSION | Default version of Node.js (**must be ~16**) |
| OPERATOR_SB_CONNECTION_STRING | Operator integration tier service bus connection string | Y |
| POSTGRES_HOST | Postgres host eg localhost | Y |
| POSTGRES_USER | Postgres user eg postgres | Y |
| POSTGRES_PASSWORD | Postgres password eg postgres | Y |
| POSTGRES_DATABASE | Database name eg bng | Y |
| POSTGRES_PORT | Postgres port eg 5432 | Y |
| POSTGRES_SSL_MODE | Postgres SSL Mode eg require or blank | N |
| CLEAR_APPLICATION_SESSION_NCRONTAB | NCRONTAB expression for clear application session timer (see [Timer trigger for Azure function app](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=in-process&pivots=programming-language-javascript#ncrontab-expressions)) | Y |
| EXPIRING_APPLICATION_SESSION_NCRONTAB | NCRONTAB expression for expiring application session timer | Y |
| NOTIFY_CLIENT_API_KEY | [Gov.UK Notify](https://www.notifications.service.gov.uk/) API key | Y |
| SAVED_APPLICATION_SESSION_TEMPLATE_ID | [Gov.UK Notify](https://www.notifications.service.gov.uk/) template ID for saved application session notifications | Y |
| EXPIRING_APPLICATION_SESSION_TEMPLATE_ID | [Gov.UK Notify](https://www.notifications.service.gov.uk/) template ID for expiring application session notifications | Y |
| CONTINUE_REGISTRATION_URL | URL contained in [Gov.UK Notify](https://www.notifications.service.gov.uk/) notifications for returning to a saved application session | Y |
| PROCESS_UNTRUSTED_ATTEMPTS | Count of attempts of process Untrusted (purpose is to replay AV scanning issues) defaults to 5 | N |
| SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED | Set to true to send an email notification when application session data is saved | N |

### App settings / environment variables for use with Azurite

When connecting to an [Azurite container](../../docs/containerisation.md/#azure-storage) a [local.settings.json](../../docker/azure-services/local.settings.template.json) template file containing a compatible set of app settings **must** be used as a starting point. This template file:

* excludes all app settings / environment variables providing connecivity to Microsoft Azure services
* includes app settings / environment variables required to provide connecivity between the Azurite container and:
  * Azure Functions
  * [GDAL](https://gdal.org/) software called by Azure Functions
* uses the hostname **azurite** to ensure connectivity to an [Azurite container](../../docs/containerisation.md) when the Azure Functions runtime is used in a containerised environment.
  * When connecting from Azure Functions in a non-containerised local environment, the hostname **azurite** must resolve to the local IP address of the host machine.
* uses the hostname **azure_services** to ensure connectivity to the [custom container](../../docs/containerisation.md) running the Azure SignalR emulator and Azure functions core tools
  * When connecting from Azure Functions in a non-containerised local environment, the hostname **azure_services** must resolve to the local IP address of the host machine.
* contains placeholders for sensitive values (such as those used to provide connectivity to threat screening services).

Run the following NPM script within the directory containing this file or the root directory of the whole mono repository to copy the template file into the directory containing this file.

```sh
npm run local:install
```

The copied file is included in the set of files ignored by git.

To reduce the risk of the template file being edited such that sensitive values are included and pushed to version control accidentally, [detect-secrets](https://github.com/Yelp/detect-secrets)
**must** be installed. If using a [Visual Studio Code development container](../../docs/local-development-quickstart.md), detect-secrets is installed by defsult. If using a local development
environment built manually, [detect-secrets must be installed manually](../../docs/manual-local-development-environment-configuration.md).

Once a copy of the template file is in place and placeholders for sensitive values are populated, the Azure functions can be run with connectivity to Azurite. If connectivity to Microsoft
Azure infrastructure is requird during local development, the copy of local.settings.json in the same directory as this file must be reconfigured accordingly.

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
