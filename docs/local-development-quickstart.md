# Local Development Quickstart

The quickest way to get started is with a [containerised development environment](https://code.visualstudio.com/docs/remote/containers).

A containerised development environment automates a number of setup activities required for a functioning local development environment such as:

* Additions to /etc/hosts file.
* Configuration of additional operating system package repositories
* Installation of additional operating system packages
* Addition of Visual Code extensions and debug configurations.
* Partial environment variable configuration.
* Installation of git hooks

The development environment as code approach ensures that all developers utilise a common development environment without having to follow detailed setup instructions
that could be erroneous, incomplete or followed incorrectly.

## Prerequisites

* **Rootful** Docker
  * Development containers are based on the [Docker in Docker](https://github.com/microsoft/vscode-dev-containers/blob/main/script-library/docs/docker-in-docker.md) image provided by Microsoft.
  * Care **must** be taken as development containers run as privileged containers due to runnning docker in docker.
    * Using development containers within a virtual machine is recommended to reduce security risks.
  * Although development containers run as an unprivileged **vscode** user, this user has passwordless sudo access.
  * If possible, rootless docker will be supported in the future to mitigate container breakout risks.
* Visual Studio Code [remote containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
* If an existing local development environment has been configured manually **it is recommended that a backup of it is created before proceeding**.

### Setup GitHub Credential Sharing

Visual Studio Code development containers provide inbuilt support for [accessing git credentials without copying them to the container](https://code.visualstudio.com/docs/remote/containers#_sharing-git-credentials-with-your-container). Ensure that your local environment is set up to allow git credential sharing.

## Create Development Container Build Arguments

The following environment variaables **must** be available to Visual Studio Code **before** the development container is created:

| name | description |
|------|-------------|
| PGADMIN_DEFAULT_PASSWORD | Password to access the pgadmin user interface for the application to register Postges database |
| POSTGRES_PASSWORD | Password for the **postgres** user of the application to register Postges database |

## Create A Development Container

* A development container can be created from either an existing directory on the development machine containing the repository contents or from a repository URL.
  * An existing directory provides easier access to the code outside the container using a bind mount.
  * When using a repository URL:
    * the code used by the container is located in a Docker volume.
    * use [git SSH URLs](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories) when cloning to ensure compatibility with credential sharing.

Please consult the [Microsoft documentation](https://code.visualstudio.com/docs/remote/containers) for further details.

After a local directory has been selected or a repository URL has been entered it will take several minutes for the containerised development environment to be be created. Internet
connection speed is a factor in how long the process takes.

## Open The Workspace

Open the Visual Studio Code workspace file (bng.code-workspace) in the root of the repository using the **File -> Open Workspace From File...** menu options in Visual Studio Code.
The workspace provides an easy way to open integrated terminals for runnable applications within the mono repository. Additionally, debug onfigurations are provided for:

* Runnable applications within the mono repository
  * [azure-functions](../packages/webapp)
  * [webapp](../packages/webapp)
* Running all Jest unit tests.
* Running  a single Jest unit test file.

## Check That Unit Tests Pass

* Open an Integrated Terminal (**File -> New Terminal** menu options) in the development container.
* Select **biodiversity-net-gain-service** from the list of available terminal options.
* Issue the command **npm test** in the terminal
  * This will take a few minutes due to initialising test doubles for cloud infrastructure where mocking is not practical.

## Populate Application To Register Web Application Secrets

Development container creation configures as many environment variables as possible including well known secrets in the public domain that enable
[Azurite](https://hub.docker.com/_/microsoft-azure-storage-azurite) connectivity.

**IMPORTANT** - The [webapp](../packages/webapp) requires the user to populate the **ORDNANCE_SURVEY_API_KEY** and
**ORDNANCE_SURVEY_API_SECRET** values in the WEBAPP_ENV file within the contanerised development environment before continuing. Please consult
[containerisation](./containerisation.md#secrets) for further information.

## Run Docker Containers Substituting Cloud Infastructure

Issue the command **npm run docker:start-infrastructure** in the terminal used to run the unit tests. It could take several minutes to initialise the containers
depending on internet connection speed.

## Running Applications In The Development Container

### Application To Register Web App

* Open an Integrated Terminal (**File -> New Terminal** menu options) in the development container.
* Select **application-to-register-web-app** from the list of available terminal options.
* Issue the command **npm run local:start** from the terminal.

### Application To Register Functions

* Open an Integrated Terminal (**File -> New Terminal** menu options) in the development container.
* Select **azure-functions** from the list of available terminal options.
* Issue the command **npm run start** from the terminal.

## Development Container Considerations

### Using Terminals Outside Visual Studio Code

If you prefer not to use Visual Studio Code integrated terminals, the docker exec command offers an alternative way to provide a terminal. For example, issue the following command in a Linux environment on a machine running a development container (substituting the container ID or container name):

```sh
docker exec -it <<container ID or container name>> bash
```

**Using bash as the shell ensures that the Python virtual environment required by the detect secrets git hook is activated automatically**.

### Increased Latency

Use of Docker in Docker increases network latency. The increased network latency causes problems when performing file uploads from a client browser through to the development container and the
containers within it. To compensate for this increased latency, [webapp](../packages/webapp) uses an additional environment variable called **KEEP_ALIVE_TIMEOUT_MS** to tune the default HTTP keep alive timeout. Development containers use a HTTP keep alive timeout of 10000ms by default. This environment variable is added to the WEBAPP_ENV
file located in the [docker secrets](../docker/secrets/) directory. within the development container.

At the moment, the introduction of a configurable keep alive timeout for use in development containers does not seem to be enough to allow the debugging of file uploads in a development container.
Debugging a file upload to an Azurite container running in the development container appears to hang. There are two recommended workarounds until this issue is resolved:

* Run [webapp](../packages/webapp) within a development container with sufficient logging.
* Debug file uploads using an uncontainerised local development environment.

### Ongoing Maintenance

Application changes requiring local development environment updates should be applied to the development container automation wherever possible.

### Backup Considerations

Pushing to GitHub or backing up regularly is recommended.

* If a development container uses a bind mount and the source of the bind mount is deleted, any local updates made in the development container **will be lost**.
* If a repository URL is cloned into a Docker volume and the volume is deleted, any local updates made in the development container **will be lost**.

### Network Connectivity Loss

If network connectivity from Docker containers is lost try restarting the docker daemon (or equivalent) on the machine running the
Visual Studio Code development container.

For example, in a Linux environment using systemd, issue the following command:

```sh
sudo systemctl restart docker
```

### Volume Permissions

If volume permissions of containers in the Visual Studio Code development container change unexpectedly, a potential reason could be
unorderly container shutdown. Restoration of required volume permissions can be achived using standard operating system commands. For example,
in a Linux environment, issue the following command (substituting the required user ID, group ID and volume path):

```sh
sudo chown -R <<user ID>>:<<group ID>> <path/to/volume>
```

### Orderely Container Management

Please consult the [containerisation](./containerisation.md) documentation.
