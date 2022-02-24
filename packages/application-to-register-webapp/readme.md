# Application to register web app

## Installation and running options as standalone application
warning: other service dependencies will be missing, install and run from root of the repository to run whole package of applications

### to run locally

Install and build the application

`npm i`

Run the application

`npm run start`

### to run in a docker container

To build and start the container

```
npm run docker:build
npm run docker:start
```

To stop and clear the container
```
npm run docker:stop
```

#### Testing
Tests require execution from the root of the mono-repository