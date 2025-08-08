# Containerisation

## Usage

Docker-based containerisation is used to enable you to run this project on a Windows machine using WSL2.

## Prerequisites

### Docker Desktop

1. Install Docker Desktop.
2. Go to Settings:
   - Check that the 'General' settings have 'Use the WSL 2 based engine' ticked.
   - Click on 'Resources' then 'WSL integration', ensure that 'Enable Integration with my default WSL distro' is ticked.

### WSL2 (Windows Subsystem for Linux 2)

WSL2 is a Windows feature that allows you to run a Linux environment directly on Windows without using a virtual machine or a dual-boot setup.

1. Install WSL 2 by opening PowerShell as Admin and run (the command will also install Ubuntu 24.04):
   ```powershell
   wsl --install -d Ubuntu-24.04
   ```
   Follow the on-screen instructions to set up your Linux user account.

2. Restart your PC.

3. Set Ubuntu 24.04 as Default:

   - To ensure you're running the version of Ubuntu you expect, open PowerShell and enter:
      ```powershell
      wsl --set-default Ubuntu-24.04
      ```

4. Verify installation:
   - Open PowerShell and run:
      ```powershell
      wsl --list --verbose
      ```
      Ubuntu 24.04 should be listed as the version.
5. Open WSL2 and update/upgrade Ubuntu:
   - Open WSL2 by opening PowerShell and entering:
     ```powershell
     wsl
	 cd
     ```
   - Update and upgrade Ubuntu with the following commands:
     ```bash
     sudo apt update && sudo apt upgrade
     ```
6. Install Azure core functions in WSL2:
	Instruction can also be found here: https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools
   - Install the Microsoft package repository GPG key, to validate package integrity:
      ```bash
      curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
      sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
      ```
	- Set up the APT source list before doing an APT update:
      ```bash
      sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-$(lsb_release -cs 2>/dev/null)-prod $(lsb_release -cs 2>/dev/null) main" > /etc/apt/sources.list.d/dotnetdev.list'
      ```
	- Start the APT source update:
      ```bash
      sudo apt-get update
      ```
   - Install Azure core functions by running:
     ```bash
     sudo apt install azure-functions-core-tools-4
     ```
   - Verify its installation with:
     ```bash
     func --version
     ```
7. Install Node in WSL2 
   - Install the latest version of NVM:
      ```bash
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
      ```
   - Install the latest LST version of NODE:
      ```bash
      nvm install --lts
      ```
8. Install Git and clone the project in WSL2:
   - Install Git with:
      ```bash
      sudo apt install git
      ```
   - Clone the BNG project:
      ```bash
      git clone https://github.com/DEFRA/biodiversity-net-gain-service.git
      ```

9. Install VSCode in WSL2:
   - Change directory so that you're inside the BNG project and install VSCode by entering:
      ```bash
      code
     ```
- Once opened install the wsl extension for VSCode by searching for 
      ```
      @exe:"wsl"
      ```
10. Accessing wsl project folder from VSCode
	- Click the icon with two arrows pointing at each other (><) in the bottom left of the VSCode window. Hovering over the icon should show text saying "Open a Remote Window"
	- Once the icon is clicked select the "Connect to WSL using Distro" option, click on the Ubuntu-24
	- Open the cloned BNG folder by clicking File>Open Folder..., then select the "biodiversity-net-gain-service" from the dropdown, press Ok
		
	 
	
## Setting up Secrets
Before building and running the Docker containers, appropriate secrets files need creating in the [**Docker secrets**](../docker/secrets/) directory.
| App     | Secret Name                  | Notes                                                                                                           |
|---------|------------------------------|-----------------------------------------------------------------------------------------------------------------|
| pgadmin | PGADMIN_DEFAULT_PASSWORD     | In the Docker secrets directory, create a file called PGADMIN_DEFAULT_PASSWORD containing the password          |
| postgis | POSTGRES_PASSWORD            | In the Docker secrets directory, create a file called POSTGRES_PASSWORD containing the password                 |
| postgis | DATABASE_VERSION_CONTROL_ENV | In the Docker secrets directory, create a file called DATABASE_VERSION_CONTROL_ENV containing the template below. For local development, this can be achieved by running the command **npm local:install** from the [database-version-control](../packages/database-version-control/) directory. |
| webapp  | WEBAPP_ENV                   | In the Docker secrets directory, create a file called WEBAPP_ENV containing the template below. For local development, this can be achieved by running the command **npm local:install** from the [webapp](../packages/webapp/) directory. |
Create the four files shown in the table above, file names should match the 'Secret Names' in column 2
 
### DATABASE_VERSION_CONTROL_ENV template
Populate the DATABASE_VERSION_CONTROL_ENV using this template:
```bash
export POSTGRES_HOST=
export POSTGRES_USER=
export POSTGRES_PASSWORD= # if password is blank we will assume managed identity is to be used for connection
export POSTGRES_DATABASE=
export POSTGRES_PORT=
export POSTGRES_SSL_MODE="" # set to require if sslmode required. (eg with azure postgres database) leave blank for local docker database.
export POSTGRES_BNG_USER_PASSWORD=
export POSTGRES_BNG_CLIENT_ID=
export POSTGRES_CONNECTION_STRING=
```
Note that this secrets template is prepopulated with variables necessary for locally run containers. See the database-version-control ReadMe for further information on variables.
### WEBAPP_ENV template
Populate the WEBAPP_ENV using this template:
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
export ORDNANCE_SURVEY_API_KEY=""
export ORDNANCE_SURVEY_API_SECRET=""
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
export SERVER_PORT=3000
export REDIS_HOST=redis
export REDIS_PORT=6379
export REDIS_PASSWORD=
export REDIS_TLS=false
export SESSION_COOKIE_PASSWORD=the-password-must-be-at-least-32-characters-long
export AZURE_STORAGE_ACCOUNT=devstoreaccount1
export AZURE_STORAGE_ACCESS_KEY="Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="
export AZURE_BLOB_SERVICE_URL="http://azurite:10000/devstoreaccount1"
export AZURE_QUEUE_SERVICE_URL="http://azurite:10001/devstoreaccount1"
export ORDNANCE_SURVEY_API_KEY=""
export ORDNANCE_SURVEY_API_SECRET=""
export MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB="50"
export MAX_GEOSPATIAL_FILE_UPLOAD_MB=50
# Override the default Node.js keep alive timeout.
# This is important for file uploads in containerised development environments.
export KEEP_ALIVE_TIMEOUT_MS=10000
export MAX_METRIC_UPLOAD_MB=50
export DEFRA_ID_ACCOUNT_MANAGEMENT_URL=
export DEFRA_ID_CLIENT_ID=
export DEFRA_ID_CLIENT_SECRET=
export DEFRA_ID_DOMAIN=
export DEFRA_ID_INSTANCE=
export DEFRA_ID_POLICY_ID=
export DEFRA_ID_REDIRECT_URI=
export DEFRA_ID_SERVICE_ID=
export DEFRA_ID_SESSION_COOKIE_PASSWORD=
export NODE_ENV=development
export ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL="N"
export ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL="N"
export ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY="Y"
export DEFRA_ID_MOCK=false
export ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY="Y"
export ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY="Y"
export ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY="Y"
```
See [GitHub actions workflow document](../.github/workflows/build.yaml) for build and CI details.
The instructions upto this point only need to be **performed once on your machine**.
The instructions below will need to be executed **every time** you want to **start the project**.
## Hostname Resolution
When working on your local development environment with Docker, it’s essential that each Docker container’s name (as defined in your docker-compose file) can be resolved from your machine’s local loopback address. In practical terms, this means that the services listed in your docker-compose file need to be added to the hosts file. By doing so, these services can communicate with each other. For instance, if you’re using a Linux development machine with a local loopback address of 127.0.0.1, you’ll modify the **/etc/hosts** file accordingly. To achieve this, simply enter the following command in your WSL2 command window
```bash
echo "127.0.0.1 azure_services azurite geoserver pgadmin postgis redis redis_commander" | sudo tee -a /etc/hosts
```
or you can add each entry line by line using:
```bash
sudo nano /etc/hosts
```
Copy and paste the following entries above the comment saying "# The following lines are desirable for IPv6 capable hosts":
```bash
127.0.0.1       azure_services
127.0.0.1       azurite
127.0.0.1       geoserver
127.0.0.1       pgadmin
127.0.0.1       postgis
127.0.0.1       redis
127.0.0.1       redis_commander
```
Save and close using:
'CTRL + X', respond with 'Y' to save changes, click Enter to close the window.
********HERE
## Development container build process
Install the dependencies needed to run the project perform the following commands in the root directory of the BNG project:

- Remove node modules:
	```bash
	rm -rf node_modules
	```

- Remove package-lock.json files:
	```bash
	rm package-lock.json
	```
	
- Clear cache
	```bash
	npm cache clean --force
	```
	
- Install required dependencies:
	```bash
	npm i
	```
To build the application images, local dev infrastructure and start containers locally that support development you'll need to run the following commands in the root directory of the project:
```sh
npm run docker:build-services
npm run docker:build-infrastructure
npm run docker:start-test-double-infrastructure
# At this point unit tests can be run that make use of the azurite container for test doubles.
# To run linting and tests (from repository root)
npm run test
```
Ensure that all the tests pass before continuing the build process.
At this point, the containerised substitutes for cloud infrastructure need starting:
```sh
npm run docker:start-infrastructure
npm run docker:start-dev-tools
```
Move to a new terminal.
Next, we need the serverless function app running.
Prerequisites and environment variables can be found here: [function docs](../packages/azure-functions/README.md). For local development, environment variables can be configured by running the command **npm local:install** from the [azure-functions](../packages/azure-functions/) directory. This is used in the sequence of commands below.
```sh
# Run the serverless functions locally, inside a new terminal (note there is no current containerisation support for the serverless functions)
cd packages/azure-functions
npm run local:install
npm run start
```
Leave the functions running and move to a new terminal.
```sh
# Build the required tables in the database
cd packages/database-version-control
npm run local:cli-up
```
Leave the functions running and move to a new terminal.
```sh
# Build the required tables in the database
cd packages/webapp
source ../../docker/secrets/WEBAPP_ENV
npm run start:dev
```
Browse to **localhost:3000** where everything should now be running and available.
## Common errors
1. When trying to start the docker container that run the services, sometimes users get a permissions error with their postgis/postgis container (insert error here). 
To fix this:
      1. Open the infrastructure.yml change the postgres user to "root" 
      2. run npm run docker:start-infrastructure 
      3. once it's done run npm run docker:stop-infrastructure
      4. revert the user back to "postgres" , and 
      5. Finally run npm run docker:start-infrastructure it should be running with no issues
## Docker tips
You can view the running containers:
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
Alternatively, see the Docker-related NPM scripts in [package.json](../package.json) for additional stop commands including `npm run docker:stop` to stop all containers.
## Cloud Service Containers
### Redis
A [Redis container](https://hub.docker.com/_/redis/) provides a substitute for [Azure Cache For Redis](https://azure.microsoft.com/en-gb/services/cache/). A [Redis Commander container](https://hub.docker.com/r/rediscommander/redis-commander/#!) provides a Graphical User Interface for the Redis container.
### Postgres
A [Postgres container](https://hub.docker.com/_/postgres/) provides a substitute for [Azure Database For Postgres](https://azure.microsoft.com/en-gb/services/postgresql/). A [pgadmin4 container](https://hub.docker.com/r/dpage/pgadmin4/#!) provides a Graphical User Interface for the Postgres container.
### Azure Storage
An [Azurite container](https://hub.docker.com/_/microsoft-azure-storage-azurite) provides a substitute for [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction).

      