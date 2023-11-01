#!/bin/sh

JEST_DEBUG_DIR=.jest-with-debug
JEST_DEBUG_ENV_FILE=${JEST_DEBUG_DIR}/.env
mkdir -p ${JEST_DEBUG_DIR}
echo NODE_DEV=test > ${JEST_DEBUG_ENV_FILE}
grep "export AZURE" bin/run-unit-tests.sh | sed 's/^export //' >> ${JEST_DEBUG_ENV_FILE}
grep "export POSTGRES" docker/secrets/DATABASE_VERSION_CONTROL_ENV | sed 's/^export //' >> ${JEST_DEBUG_ENV_FILE}
echo "(Re)created ${JEST_DEBUG_ENV_FILE}"
