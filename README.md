# biodiversity-net-gain-service

#### For Natural England

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=alert_status)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=ncloc)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_biodiversity-net-gain-service&metric=bugs)](https://sonarcloud.io/dashboard?id=DEFRA_biodiversity-net-gain-service)

[Lerna](https://lerna.js.org/) managed nodejs project for Biodiversity Net Gain service

## Getting started

#### Secrets

Before building and running the docker containers the secrets files within docker/env/ will need updating accordingly to run

See [Github actions workflow document](.github/workflows/build.yaml) for build and CI details

To install and build all packages

`npm i`

To run linting and tests

`npm run test`

## Installation, run options, running

#### Swarm mode (rootful docker required)

`optional` First set docker to swarm mode if not already

```
docker swarm init
```

Build application images and run containers in swarm mode

```
npm run docker:build
npm run docker:start-swarm
```

#### docker-compose up (not swarm mode) if rootless docker necessary

To build the application images and run the containers without a swarm

```
npm run docker:build
npm run docker:start-compose
```

View the running containers

```
docker ps
```

Stop the running containers

```
npm run docker:stop-compose
```

To run apps individually view their respective README files.

## Packages

| Package | Description | Runnable |
| ----------- | ----------- | ----------- |
| [application-to-register-webapp](packages/application-to-register-webapp) | Client side web application for registration journey | Y | 