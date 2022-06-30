# Containerisation

## Usage

Docker based containerisation is used for the following:

* Substitution of cloud services during local development and unit tests where alternatives to mocking are required.
* Packaging and running of:
  * [application-to-register-webapp](../packages/application-to-register-webapp)

## Prerequisites

### Secrets

Before building and running the docker containers appropriate secrets files need creating.

| App | Secret Name | Notes |
| ----------- | ----------- | ----------- |
| pgadmin | PGADMIN_DEFAULT_PASSWORD | ----------- |
| postgis | POSTGRES_PASSWORD | ----------- |
| application_to_register_webapp | WEBAPP_ENV | see WEBAPP_ENV template below for contents |

### WEBAPP_ENV template

Note that this secrets template is prepopulated with variables necessary for locally run containers. See the webapp ReadMe for further information on variables.

```bash
export SERVER_PORT=3000
export REDIS_HOST=redis
export REDIS_PORT=6379
export REDIS_PASSWORD=
export REDIS_TLS=false
export SESSION_COOKIE_PASSWORD=the-password-must-be-at-least-32-characters-long
export AZURE_STORAGE_ACCOUNT=devstoreaccount1
export AZURE_STORAGE_ACCESS_KEY="Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="
export AZURE_BLOB_SERVICE_URL="http://azurite:10000/${AZURE_STORAGE_ACCOUNT}"
export AZURE_QUEUE_SERVICE_URL="http://azurite:10001/${AZURE_STORAGE_ACCOUNT}"
export ORDNANCE_SURVEY_API_KEY=""
export ORDNANCE_SURVEY_API_SECRET=""
export MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB="50"
# Change to http://azure_services:7071/api if the application to register web application is running in a container.
export SIGNALR_URL="http://azure_services:8082/api"
```

See [Github actions workflow document](../.github/workflows/build.yaml) for build and CI details

### Development container build process

```bash
#To build the application images, local dev infrastructure and start containers locally that support development
npm run docker:build-services
npm run docker:build-dev-infrastructure
npm run docker:start-dev-infrastructure

#At this point unit tests can be run that make use of the signalr and azurite containers for test doubles.
#To run linting and tests (from repository root)

```bash
npm run test
```

Ensure that all the tests pass before continuing the build process.

Next we need the serverless function app running

Prerequisites and environment variables can be found here: [function docs](../packages/application-to-register-functions/README.md)

```bash
#Run the serverless functions locally, inside a new terminal (note there is no current containerisation support for the serverless functions)
cd packages/application-to-register-functions
npm run start
```

Leave the functions running and move to a new terminal or the previous.

At this point if wanting to run the webapp as a local process (for development/debug) then see the [webapp docs](../packages/application-to-register-webapp/README.md)

Otherwise to run the webapp as a container, continue...

Back at the repository root directory

```bash
npm run docker:start-infrastructure
npm run docker:start-services
```

Browse to localhost:3000 where everything should now be running and available

### Docker tips

You can view the running containers

```bash
# view running containers
docker ps

# view container logs
docker container logs {container_id_or_first_few_characters} -f # -f to watch log output
```

See the docker scripts in [package.json](../package.json) for individual stop commands or use `npm run docker:stop` to stop all containers

## Cloud Service Containers

### Redis

A [Redis container](https://hub.docker.com/_/redis/) provides a substitute for [Azure Cache For Redis](https://azure.microsoft.com/en-gb/services/cache/). A [Redis Commander container](https://hub.docker.com/r/rediscommander/redis-commander/#!) provides a Graphical User Interface for the Redis container.

### Postgres

A [Postgres container](https://hub.docker.com/_/postgres/) provides a substitute for [Azure Database For Postgres](https://azure.microsoft.com/en-gb/services/postgresql/). A [pgadmin4 container](https://hub.docker.com/r/dpage/pgadmin4/#!) provides a Graphical User Interface for the Postgres container.

### Azure Storage

An [Azurite container](https://hub.docker.com/_/microsoft-azure-storage-azurite) provides a substitute for [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction).

### Azure SignalR

A custom container running the [Azure SignalR emulator](https://github.com/Azure/azure-signalr/blob/dev/docs/emulator.md) and [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) provides a subsitute for [Azure Serverless SignalR](https://docs.microsoft.com/en-us/azure/azure-signalr/signalr-quickstart-azure-functions-javascript).
