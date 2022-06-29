#!/bin/sh

# The geoprocessing service delegates to native code that requires this environment variable for Azurite connectivity.
# Environment variables set through Node.js do not appear to propagate to native code.
export AZURE_STORAGE_CONNECTION_STRING="${AZURITE_STORAGE_CONNECTION_STRING:-DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;}"

destroy_test_double_infrastructure=0

if `nc -z localhost 10000 && nc -z localhost 10001 && nc -z localhost 8082 && nc -z localhost 8888`; then
  echo Test double infrastructure is running
else
  echo Setting up test double infrastructure
  npm run docker:start-test-double-infrastructure
  destroy_test_double_infrastructure=1
fi

jest --runInBand

# Use the exit code from Jest as the script exit code so that test
# failures are propagated to any continuous integration/deployment
# pipeline.
exitCode=$?

if [ ${destroy_test_double_infrastructure} = 1 ]; then
  npm run docker:stop-test-double-infrastructure
  echo Test double infrastructure has been destroyed
fi

exit ${exitCode}
