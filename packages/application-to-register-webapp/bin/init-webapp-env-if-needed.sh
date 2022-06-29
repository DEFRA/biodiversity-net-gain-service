#!/bin/sh

webapp_env_docker_secret="docker/secrets/WEBAPP_ENV"
webapp_env_docker_secret_path="../../${webapp_env_docker_secret}"
webapp_env_template="local-application-to-register-webapp-env-template"

if [ ! -f ${webapp_env_docker_secret_path} ] && [ ! -L ${webapp_env_docker_secret_path} ]; then
  cp ../../docker/azure-services/${webapp_env_template} ${webapp_env_docker_secret_path}
  echo Created ${webapp_env_docker_secret} file with Azurite connectivity
  echo Please populate mandatory secrets before use 
elif [ -L ${webapp_env_docker_secret_path} ]; then
  echo ${webapp_env_docker_secret} symbolic link exists
else
  echo ${webapp_env_docker_secret} file exists
fi
