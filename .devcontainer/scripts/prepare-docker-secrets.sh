#!/bin/sh

mkdir -p ${HOME}/biodiversity-net-gain-service-tmp/docker/secrets
echo ${PGADMIN_DEFAULT_PASSWORD} >> ${HOME}/biodiversity-net-gain-service-tmp/docker/secrets/PGADMIN_DEFAULT_PASSWORD
echo ${POSTGRES_PASSWORD} >> ${HOME}/biodiversity-net-gain-service-tmp/docker/secrets/POSTGRES_PASSWORD
