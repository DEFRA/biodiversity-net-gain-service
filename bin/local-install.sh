#!/bin/sh

(cd packages/azure-functions && npm run local:install)
(cd packages/webapp && npm run local:install )
./bin/init-jest-debug-env-file.sh
