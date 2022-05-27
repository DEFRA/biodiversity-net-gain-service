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
| [application-to-register-functions](packages/application-to-register-functions) | Microsoft Azure functions for registration journey  | Y |
| [application-to-register-webapp](packages/application-to-register-webapp) | Client side web application for registration journey | Y |
| [azurite-bootstrap-service](packages/azurite-bootstrap-service) | A service for creating Biodiversity Net Gain Service Azure storage infrastructure within an [Azurite](https://hub.docker.com/_/microsoft-azure-storage-azurite) instance | Y |
| [azure-storge-test-utils](packages/azure-storge-test-utils) | Azure storage related functions for use during **unit testing** | N |
| [connectors-lib](packages/connectors-lib) | A library providing connectivity to various dependencies such as cloud resources | N |
| [document-service](packages/connectors-lib) | A library providing cloud vendor agnostic document related functionality | N |
| [errors](packages/errors) | Custom errors used by the Biodiversity Net Gain service | N |
| [geoprocessing-service](packages/geoprocessing-service) | A library providing cloud vendor agnostic geoprocessing functionality | N |

## Getting started

* [Prerequisites](docs/prerequisites.md)
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
