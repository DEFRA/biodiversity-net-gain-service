# Containerisation

## Usage

Docker based containerisation is used for the following:

* Substitution of cloud services during local development.
* Packaging and running of:
  * [application-to-register-webapp](../packages/application-to-register-webapp)

## Prerequisites

### Secrets

Before building and running the docker containers the secrets files need creating in docker/secrets.
The name of the file is the secret name (no extension), the contents are plain text of the value of the secret

| App | Secret Name | Notes |
| ----------- | ----------- | ----------- |
| pgadmin | PGADMIN_DEFAULT_PASSWORD | ----------- |
| postgis | POSTGRES_PASSWORD | ----------- |
| application_to_register_webapp | SESSION_COOKIE_PASSWORD | minimum 32 characters |

See [Github actions workflow document](../.github/workflows/build.yaml) for build and CI details

To install and build all packages

`npm i`

To run linting and tests

`npm run test`

## Installation, run options, running

### Swarm mode (rootful docker required)

`optional` First set docker to swarm mode if not already

```bash
docker swarm init
```

Create pgadmin docker volume and give it permissions for pgadmin process to access, see /docker/infrastructure.development.yml for more detail

```bash
mkdir docker/volumes/pgadmin
sudo chown -R 5050:5050 docker/volumes/pgadmin
```

Create postgis volume (container takes care of permissions)
Postgres does not like any files existing in the data directory when initialising the database and give access to container uid, see /docker/infrastructure.yml for more detail

```bash
mkdir docker/volumes/postgis
sudo chown -R 70:70 docker/volumes/postgis
```

### Note that for a rootless docker set up the ownership of the postgis and pgadmin volume directories need setting as follows

Calculate UID And GID for the host user mapped to the postgres and pgadmin container users:

Host UID = (Minimum subuid for rootless docker host user defined in /etc/subuid + container UID) - 1

Host GID = (Minimum subgid for rootless docker host user defined in /etc/subgid + container GID) - 1

```bash
sudo chown -R <<postgres Host UID>>:<<postgres Host GID>>  docker/volumes/postgis
sudo chown -R <<pgadmin Host UID>>:<<pgadmin Host GID>>  docker/volumes/pgadmin
```

Create geoserver data directory, this will be stored in source control at somepoint to store configuration/layers etc, however TODO is to strip out security risks and inject with build.
Therefore for the time being the workspace, datastore and layers need creating manually through the geoserver interface at <http://localhost:8080/geoserver>

```bash
mkdir docker/volumes/geoserver
```

Build application images and run containers in swarm mode, `npm run docker:start-dev` includes development tools such as redis commander and pgadmin, switch this out for `npm run docker:start` if those tools are not required, ie when deployed to cloud/production environments

```bash
npm run docker:build
npm run docker:start-dev
```

To stop the swarm and tear down the services

```bash
npm run docker:stop
```

### docker-compose up (not swarm mode) if rootless docker necessary

To build the application images and run the containers without a swarm

```bash
npm run docker:build
npm run docker:start-compose
```

View the running containers

```bash
docker ps
```

Stop the running containers

```bash
npm run docker:stop-compose
```
