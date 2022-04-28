# Prerequisites

## Build Prerequisites

* Node 16 or above
* Either of:
  * Rootful Docker 20.x or above
  * Rootless Docker 20.x or above and compatible version of Docker Compose
* UNIX based operating system

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
* Microsoft Azure SignalR hub
* **Node.js** Microsoft Azure function app
* Access to the [Ordnance Survey Maps API](https://osdatahub.os.uk/docs/wmts/overview).

## Microsoft Azure Blob Containers

* Microsoft Azure blob container named **untrusted**.
  * This blob container holds user uploads prior to security processing.
* Microsoft Azure blob container named **trusted**.
  * This blob container holds:
    * User uploads that have been through security processing.
    * System generated files in response to user uploads.

## Microsoft Azure Storage Queues

* Microsoft Azure storage queue named **untrusted-file-queue**
  * Messages placed on this queue are used to trigger Azure function based processing of blobs placed in the untrusted container. Queue based triggering is used due to:
    * blob triggering being poll based
    * event grid blob triggering being in public preview

## Required Connectivity

* Please refer to the documentation for each package within the repository.
