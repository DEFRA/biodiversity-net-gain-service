#!/bin/sh

WEBAPP_ENV=docker/secrets/WEBAPP_ENV

# Allow npm package installation without using sudo
( echo NPM_PACKAGES="/home/vscode/.npm-packages"; echo PATH="/home/vscode/.npm-packages/bin:$PATH") >> ${HOME}/.bashrc

${HOME}/biodiversity-net-gain-service-tmp/scripts/install-detect-secrets.sh
# Ensure the Python virtual environment is activated when a bash terminal is opened.
echo "source ${HOME}/Software/python/virtual-envs/bng/bin/activate" >> ${HOME}/.bashrc
rm -rf /home/vscode/biodiversity-net-gain-service-tmp/
# Install node modules
npm i
# Configure for local development
(cd packages/application-to-register-webapp && npm run local:install)

grep -q KEEP_ALIVE_TIMEOUT_MS ${WEBAPP_ENV}
GREP_RETURN_CODE=$?

if [ ${GREP_RETURN_CODE} != 0 ]; then
  echo "# Override the default Node.js keep alive timeout." >> ${WEBAPP_ENV}
  echo "# This is important for file uploads in containerised development environments." >> ${WEBAPP_ENV}
  echo "export KEEP_ALIVE_TIMEOUT_MS=10000" >> ${WEBAPP_ENV}
fi
