# biodiversity-net-gain-service

## For Natural England

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=alert_status)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=ncloc)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=bugs)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)

[Lerna](https://lerna.js.org/) managed nodejs project for Biodiversity Net Gain service

## Packages

| Package | Description | Runnable |
| ----------- | ----------- | ----------- |
| [azure-functions](packages/azure-functions) | Microsoft Azure functions for the Biodiversity Net Gain service | Y |
| [webapp](packages/webapp) | Client side web application for the Biodiversity Net Gain service | Y |
| [azurite-bootstrap-service](packages/azurite-bootstrap-service) | A service for creating Biodiversity Net Gain Service Azure storage infrastructure within an [Azurite](https://hub.docker.com/_/microsoft-azure-storage-azurite) instance | Y |
| [azure-storge-test-utils](packages/azure-storge-test-utils) | Azure storage related functions for use during **unit testing** | N |
| [connectors-lib](packages/connectors-lib) | A library providing connectivity to various dependencies such as cloud resources | N |
| [document-service](packages/connectors-lib) | A library providing cloud vendor agnostic document related functionality | N |
| [errors](packages/errors-lib) | Custom errors used by the Biodiversity Net Gain service | N |
| [utils](packages/utils-lib) | Utilities used by the Biodiversity Net Gain service | N |
| [geoprocessing-service](packages/geoprocessing-service) | A library providing cloud vendor agnostic geoprocessing functionality | N |
| [database-version-control](packages/database-version-control) | [Slonik migrator](https://www.npmjs.com/package/@slonik/migrator) based version controlled database scripting for the Biodiversity Net Gain service. | Y |
| [bng-metric-service](packages/bng-metric-service) | A library to provide Biodiversity metric file extraction related functions | N |

## Getting started

* [Prerequisites](docs/prerequisites.md)
* [Local Development Quickstart Using Visual Studio Code Development Containers](docs/local-development-quickstart.md)
* [Configuring And Running An Uncontainerised Local Development Environment Manually](docs/manual-local-development-environment-configuration.md)
* [Containerisation](docs/containerisation.md)

Please consult package specific documentation.

## Contributing to this project

If you have an idea you'd like to contribute please log an issue.

All contributions should be submitted via a pull request.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

[http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3)

The following attribution statement MUST be cited in your products and applications when using this information.
> Contains public sector information licensed under the Open Government license v3

### Sources of land boundary data licenced under the Open Government Licence

English, Scottish and Welsh land boundary data within database scripts of the [database-version-control](packages/database-version-control) package is derived from
the following sources:

* **English boundary data** - [Administrative Boundaries - Environment Agency and Natural England Public Face Areas](https://environment.data.gov.uk/dataset/91d0fb43-209c-477f-91e3-74e756296268)
* **Scottish boundary data** - [Scottish Local Government Improvement Service Local Authority Boundaries](https://data.spatialhub.scot/dataset/local_authority_boundaries-is/resource/d24c5735-0f1c-4819-a6bd-dbfeb93bd8e4)
* **Welsh boundary data** - [Electroral Ward Boundaries of Wales](https://datamap.gov.wales/layers/geonode:Wales_Ward_Boundaries_hwm)
