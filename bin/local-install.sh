#!/bin/sh

(cd packages/application-to-register-functions && npm run local:install)
(cd packages/application-to-register-webapp && npm run local:install )
./bin/init-jest-debug-env-file.sh
