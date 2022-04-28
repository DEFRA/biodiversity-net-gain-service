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

## App settings / environment variables

| name    | description | mandatory |
|---------|-------------|-----------|
| APPINSIGHTS_INSTRUMENTATIONKEY | Instrumentation key controlling if telemetry is sent to the ApplicationInsights service | Y |
| APPLICATIONINSIGHTS_CONNECTION_STRING | ApplicationInsights service connection string used by the function app | Y |
| AZURE_SIGNALR_HUB_NAME | Name of the SignalR hub facilitating communication between the functions and web application | Y|
| AzureWebJobsStorage | Storage account connection string used by the function app | Y |
| FUNCTIONS_EXTENSION_VERSION | Functions runtime version (**must be ~4**) | Y |
| FUNCTIONS_WORKER_RUNTIME | The language worker runtime to load in the function app (**must be node**) | Y |
| ORDNANCE_SURVEY_API_KEY | Key used to access Ordnance Survey APIs | Y |
| ORDNANCE_SURVEY_API_SECRET | Secret used to access Ordnance Survey APIs | Y |
| WEBSITE_CONTENTAZUREFILECONNECTIONSTRING | Connection string for storage account where the function app code and configuration are stored in event-driven scaling plans running on Windows | Plan dependent |
| WEBSITE_CONTENTSHARE | The file path to the function app code and configuration in an event-driven scaling plan on Windows | Plan dependent |
| WEBSITE_NODE_DEFAULT_VERSION | Default version of Node.js (**must be ~16**) |

## Installation

The following activities need to be performed for the functions to run. While the documentation states what activities need to be performed it does not prescribe how the activities should be performed.

* Ensure that all prerequisites exist.
* Configure app settings / environment variables.
* Install node modules.
* To run the functions in a Microsoft Azure environment, deploy the functions to a function app.
* To run the functions in a local environment issue the command **func start** from the directory containing this file.
  * This command requires local installation of Azure Function Core Tools as defined in the **Local prerequisites** section above.
