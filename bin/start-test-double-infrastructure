#!/bin/sh
export DOCKER_BUILDKIT=1
docker-compose -f docker/infrastructure.yml up -d azure_services azurite
echo Waiting for test double infrastructure to initialise
# Sleep for thirty seconds as the nc utility appears to report successful connectivity on test double infrastructure ports before requests can be processed successfully.
sleep 30
npm run bootstrap-azurite