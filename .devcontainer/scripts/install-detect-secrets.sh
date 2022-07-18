#!/bin/sh

VIRTUAL_ENVS=${HOME}/Software/python/virtual-envs
mkdir -p ${VIRTUAL_ENVS}
(cd ${VIRTUAL_ENVS} && python3 -m venv bng)
. ${VIRTUAL_ENVS}/bng/bin/activate
pip install detect-secrets
pip install pre-commit
pre-commit install
