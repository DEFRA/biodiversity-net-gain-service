#!/bin/sh

WEBAPP_ENV_DOCKER_SECRET="docker/secrets/WEBAPP_ENV"
WEBAPP_ENV_DOCKER_SECRET_PATH="../../${WEBAPP_ENV_DOCKER_SECRET}"
WEBAPP_ENV_TEMPLATE="local-application-to-register-webapp-env-template"

if [ ! -f ${WEBAPP_ENV_DOCKER_SECRET_PATH} ] && [ ! -L ${WEBAPP_ENV_DOCKER_SECRET_PATH} ]; then
  cp ../../docker/azure-services/${WEBAPP_ENV_TEMPLATE} ${WEBAPP_ENV_DOCKER_SECRET_PATH}
  echo Created ${WEBAPP_ENV_DOCKER_SECRET} file with Azurite connectivity
  echo Please populate mandatory secrets before use 
elif [ -L ${WEBAPP_ENV_DOCKER_SECRET_PATH} ]; then
  echo ${WEBAPP_ENV_DOCKER_SECRET} symbolic link exists
else
  echo ${WEBAPP_ENV_DOCKER_SECRET} file exists
fi
