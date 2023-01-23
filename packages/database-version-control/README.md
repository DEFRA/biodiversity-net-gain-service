# Version controlled database scripting

[Slonik migrator](https://www.npmjs.com/package/@slonik/migrator) based version controlled database scripting for the Biodiversity Net Gain service.

## Supported authentication methods

Password and [Microsoft Azure managed identity](https://learn.microsoft.com/en-gb/azure/active-directory/managed-identities-azure-resources/overview) based authentication support is provided for user accounts created using database migrations. The authentication mode is controlled through environment variables. Password authentication is used when connecting to a
database to perform database version control activities.

## Environment variables

| name    | description | mandatory |
|---------|-------------|-----------|
| POSTGRES_HOST | Host of database | Y |
| POSTGRES_USER | User of database administrative account | Y |
| POSTGRES_PASSWORD | Password of administrative account, leave blank to assume managed identity | N |
| POSTGRES_DATABASE | Database name | Y |
| POSTGRES_PORT | Database port | Y |
| POSTGRES_SSL_MODE | SSL type, set blank for none for local docker database, or 'require' for azure postgresql service | N |
| POSTGRES_BNG_USER_PASSWORD | Password for a runtime user account with read write access to Biodiversity Net Gain database elements | Y (if using password based authentication) |
| POSTGRES_BNG_CLIENT_ID | Microsoft Azure managed identity client ID for a runtime user account with read write access to Biodiversity Net Gain database elements | Y (if using Microsoft Azure managed identity based authentication) |

## Running

### Standard command line interface

The command line interface is run using comands of the form:

```sh
node src/migrator-cli.js {{command }}
```

Example

To rollback all migrations:

```sh
node src/migrator-cli.js down --to 0
```

**Note that all mandatory environment variables must be set before running commands this way.**

### Convenience NPM scripts

This package provides a number of convenience npm scripts for calling the Slonik migrator command line interface. NPM scripts are provided for running commands against local and
non-local Postgres instances.

* Environment variables **must** be set before running any NPM scripts with a non-local database.
* Environment variables for local development are used by all NPM scripts provided for use with a non-local database.
  * Note that local environment variables must be set before use - see [documentation](../../docs/containerisation.md#secrets)

| script | purpose |
|---------|--------|
| cli-up | Run pending migrations using a non-local database |
| local:cli-up | Run pending migrations using a local database |
| cli-down | Rollback existing migrations using a non-local database |
| local:cli-down | Rollback migrations using a local database |
| cli-pending | Show all pending migrations using a non-local database |
| local:cli-pending | Show all pending migrations using a local database |
| cli-executed | Show applied migrations using a non-local database |
| local:cli-executed | Show applied migrations using a local database |
| cli-create | Create a new migration file when using non-local database configuration |
| local:cli-create | Create a new migration file when using local database database configuration |
| cli-repair | Repair migrations using a non-local database |
| local:cli-repair | Repair migrations using a local database |

#### NPM script arguments

NPM script arguments can be used to pass arguments to the convenience scripts using the format:

```sh
npm run {{NPM script name}} -- {{Arguments passed to the Slonik tools migrator command line interface}}
```

Example

To use environment variables for local development and rollback all migrations using a local database:

```sh
npm run local:cli-down -- --to 0
```

### Programmtic interface

A programmtic interface is provided by [src/migrator.js](src/migrator.js).

## Use of CommonJS

Unlike other Lerna packages in the enclosing mono repository this package uses CommonJS currently. Migration to the use of ES Modules will be performed if possible.
