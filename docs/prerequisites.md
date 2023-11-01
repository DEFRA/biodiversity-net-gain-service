# Prerequisites

## Build Prerequisites

* Node 16 or above
* Either of:
  * Rootful Docker 20.x or above and compatible version of Docker Compose
  * Rootless Docker 20.x or above and compatible version of Docker Compose
* UNIX based operating system with bash, the nc utility and support for Python3 virtual environments installed
  * If using Microsoft Windows, you may wish to consider using the [Windows Subsystem For Linux](https://docs.microsoft.com/en-us/windows/wsl/about).

## Runtime Prerequisites

* Microsoft Azure resource group
* Microsoft Azure storage account
* Microsoft Azure Cache for Redis
  * A containerised Redis instance can be used for local development
* Microsoft Azure Database for PostgresSQL
  * A containerised PostgresSQL instance can be used for local development
  * The following PostresSQL extensions need to be installed:
    * postgis
    * postgis_topology
    * uuid-ossp
* **Node.js** Microsoft Azure function app
* Access to the [Ordnance Survey Maps API](https://osdatahub.os.uk/docs/wmts/overview).

## Firewall Prerequisites

If running with rootful Docker in a firewalled environment, outbound connectivity to the Docker network in use must be allowed.

## Microsoft Azure Blob Containers

* Microsoft Azure blob container named **untrusted**.
  * This blob container holds user uploads prior to security processing.
* Microsoft Azure blob container named **trusted**.
  * This blob container holds:
    * User uploads that have been through security processing.
    * System generated files in response to user uploads.

## Microsoft Azure Storage Queues

* Microsoft Azure storage queue named **untrusted-file-queue**
  * Messages placed on this queue are used to trigger Azure function based processing of blobs placed in the untrusted container.
* Microsoft Azure storage queue named **trusted-file-queue**
  * Messages placed on this queue are used to trigger Azure function based processing of blobs placed in the trusted container.
* Microsoft Azure storage queue named **saved-application-session-notification-queue**
  * Messages placed on this queue are used to trigger an Azure Function for sending an email notification when an incomplete application
    to the Biodiversity Net Gain public register is saved.
* Microsoft Azure storage queue named **expiring-application-session-notification-queue**
  * Messages placed on this queue are used to trigger an Azure Function for sending an email notification when a saved, incomplete
    application to the Biodiversity Net Gain public register is near to expiriring.

* Storage queue based triggering is used due to:
  * blob triggering being poll based
  * event grid blob triggering being in public preview

## Microsoft Azure Service Bus Queues

* Microsoft Azure service bus queue named **ne.bng.landowner.inbound**
  * Messages are placed on this queue to trigger operator processing of a submitted application to the Biodiversity Net Gain public register.

## Microsoft Azure Service Bus Topics And Subscriptions

* Microsoft Azure service bus topic named **defra.trade.filestore.notify** with a subscription called **filestore-notify-bng**.
  * Messages placed on this topic are used to process threat screening results of uploads to the Biodiversity Net Gain service.

## Required Connectivity

* Please refer to the documentation for each package within the repository.
