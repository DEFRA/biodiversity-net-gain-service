#!/bin/bash

export AZURE_STORAGE_ACCOUNT=${AZURITE_HOST:-devstoreaccount1}
export AZURE_STORAGE_ACCESS_KEY=${AZURITE_STORAGE_ACCESS_KEY:-Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==}

if  `nc -z ${AZURITE_HOST:-localhost} ${AZURITE_BLOB_PORT:-10000}` ; then
  if  `nc -z ${AZURITE_HOST:-localhost} ${AZURITE_QUEUE_PORT:-10001}`; then
  node src/service.js
  else
    echo No running Azurite queue service has been detected
  fi
else
  echo No running Azurite blob service has been detected
fi
