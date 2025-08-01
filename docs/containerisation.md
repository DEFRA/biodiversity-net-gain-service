# Containerisation

## Usage

Docker based containerisation is used for the following:

* Substitution of cloud services during local development and unit tests where alternatives to mocking are required.
* Packaging and running of:
  * [webapp](../packages/webapp)

## Prerequisites

### Hostname Resolution

During local development each Docker container name defined in a docker compose file **must** be resolvable from the local loopback address of
the development machine. For example, on a Linux development machine with a local loopback address of 127.0.0.1, /etc/hosts **must** be modified
to include the following entries:

```sh
127.0.0.1       azure_services
127.0.0.1       azurite
127.0.0.1       geoserver
127.0.0.1       pgadmin
127.0.0.1       postgis
127.0.0.1       redis
127.0.0.1       redis_commander
```

### Secrets

Before building and running the docker containers, appropriate secrets files need creating in the [**Docker secrets**](../docker/secrets/) directory

| App | Secret Name | Notes |
| ----------- | ----------- | ----------- |
| pgadmin | PGADMIN_DEFAULT_PASSWORD | In the Docker secrets directory, create a file called PGADMIN_DEFAULT_PASSWORD containing the password |
| postgis | POSTGRES_PASSWORD | In the Docker secrets directory, create a file called POSTGRES_PASSWORD containing the password |
| postgis | DATABASE_VESION_CONTROL_ENV | In the Docker secrets directory, create a file called DATABASE_VESION_CONTROL_ENV containing the template below. For local development, this can be achieved by running the command **npm local:install** from the [database-version-control](../packages/database-version-control/) directory. |
| webapp | WEBAPP_ENV | In the Docker secrets directory, create a file called WEBAPP_ENV containing the template below. For local development, this can be achieved by running the command **npm local:install** from the [webapp](../packages/webapp/) directory. |

### DATABASE_VESION_CONTROL_ENV template

```bash
export POSTGRES_CONNECTION_STRING=
export POSTGRES_BNG_USER_PASSWORD=
export POSTGRES_BNG_CLIENT_ID=
```

Note that this secrets template is prepopulated with variables necessary for locally run containers. See the database-version-control  ReadMe for further information on variables.

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
export AZURE_BLOB_SERVICE_URL="http://azurite:10000/devstoreaccount1"
export MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB="50"
export SERVICE_HOME_URL="http://localhost:3000"
export DEFRA_ID_SESSION_COOKIE_PASSWORD=""
export DEFRA_ID_POLICY_ID=""
export DEFRA_ID_SERVICE_ID=""
export DEFRA_ID_INSTANCE=""
export DEFRA_ID_DOMAIN=""
export DEFRA_ID_CLIENT_SECRET=""
export DEFRA_ID_CLIENT_ID=""
export DEFRA_ID_REDIRECT_URI=""
export MAX_GEOSPATIAL_FILE_UPLOAD_MB="1"
```

See [Github actions workflow document](../.github/workflows/build.yaml) for build and CI details

### Development container build process

```sh
# To build the application images, local dev infrastructure and start containers locally that support development
npm run docker:build-services
npm run docker:build-infrastructure
npm run docker:start-test-double-infrastructure

# At this point unit tests can be run that make use of the azurite container for test doubles.
# To run linting and tests (from repository root)

```sh
npm run test
```

Ensure that all the tests pass before continuing the build process.

At this point the containerised substitutes for cloud infrastructure need starting:

```sh
npm run docker:start-infrastructure
```

Move to a new terminal

Next we need the serverless function app running

Prerequisites and environment variables can be found here: [function docs](../packages/azure-functions/README.md)
For local development, environment variables can be configured by running the command **npm local:install** from the
[azure-functions](../packages/azure-functions/) directory. This is used in the sequence of commands below.

```sh
# Run the serverless functions locally, inside a new terminal (note there is no current containerisation support for the serverless functions)
cd packages/azure-functions
npm run local:install
npm run start
```

Leave the functions running and move to a new terminal.

At this point if wanting to run the webapp as a local process (for development/debug) then see the [webapp docs](../packages/webapp/README.md)

Otherwise to run the webapp as a container, continue...

From the repository root directory

```sh
npm run docker:start-services
```

Browse to localhost:3000 where everything should now be running and available

### Docker tips

You can view the running containers

```sh
# view running containers
docker ps

# view container logs
docker container logs {container_id_or_first_few_characters} -f # -f to watch log output

# stop all running containers
docker stop $(docker ps -aq)

# start all stopped containers
docker start $(docker ps -aq)

# remove all stopped containers
docker rm $(docker ps -aq)

# stop one container
docker stop {container id or container name}

# start one stopped container
docker start {container id or container name}

# remove one stopped container
docker rm {container id or container name}
```

Alternaively, see the docker related NPM scripts in [package.json](../package.json) for additional stop commands includng `npm run docker:stop` to stop all containers

## Toubleshoot
### Postgis Container
On linux postgis container might failed due to permission issues, and there are few tips to resolve it as follows;
1. Check logs of postgis container
    It will show this error
    ```sh
    chmod: /var/lib/postgresql/data: Operation not permitted
    The files belonging to this database system will be owned by user "postgres".
    This user must also own the server process.
    ```
    To resolve this issue, check user id of postgres and change the owner of /docker/volume/postgis

    ```sh
    sudo chown -R <user id/name>:<group id/name> /docker/volume/postgis
    ``` 

## Cloud Service Containers

### Redis

A [Redis container](https://hub.docker.com/_/redis/) provides a substitute for [Azure Cache For Redis](https://azure.microsoft.com/en-gb/services/cache/). A [Redis Commander container](https://hub.docker.com/r/rediscommander/redis-commander/#!) provides a Graphical User Interface for the Redis container.

### Postgres

A [Postgres container](https://hub.docker.com/_/postgres/) provides a substitute for [Azure Database For Postgres](https://azure.microsoft.com/en-gb/services/postgresql/). A [pgadmin4 container](https://hub.docker.com/r/dpage/pgadmin4/#!) provides a Graphical User Interface for the Postgres container.

### Azure Storage

An [Azurite container](https://hub.docker.com/_/microsoft-azure-storage-azurite) provides a substitute for [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction).
