#!/bin/sh

DATABASE_VERSION_CONTROL_ENV_FILE=./bin/jest-database-version-control-env.sh
sed 's/^process.env./export /' packages/database-version-control/.jest/test.env.js > ${DATABASE_VERSION_CONTROL_ENV_FILE}
chmod +x ${DATABASE_VERSION_CONTROL_ENV_FILE}
echo "(Re)created ${DATABASE_VERSION_CONTROL_ENV_FILE}"
