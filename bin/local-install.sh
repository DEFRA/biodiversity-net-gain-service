#!/bin/sh

(cd packages/application-to-register-functions && bin/init-local-settings-if-needed.sh)
(cd packages/application-to-register-webapp && bin/init-webapp-env-if-needed.sh)
./bin/init-jest-debug-env-file.sh
