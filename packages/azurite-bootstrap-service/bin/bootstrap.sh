#!/bin/bash

if  `nc -z ${AZURITE_HOST:-localhost} ${AZURITE_BLOB_PORT:-10000}` ; then
  if  `nc -z ${AZURITE_HOST:-localhost} ${AZURITE_QUEUE_PORT:-10001}`; then
  node src/service.js
  else
    echo No running Azurite queue service has been detected
  fi
else
  echo No running Azurite blob service has been detected
fi
