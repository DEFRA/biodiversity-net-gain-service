#!/bin/sh

apt-get update -y && apt-get install -y lsb-release apt-utils && apt-get clean all
# Install the Microsoft package signing key and repository.
curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/ && rm packages.microsoft.gpg
sh -c 'echo "deb [arch=amd64 signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/debian/$(lsb_release -rs | cut -d'.' -f 1)/prod $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnetdev.list'
# Install Nodesource package signing key and the Node.js 16 LTS repository.
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor > nodesource.gpg
install -o root -g root -m 644 nodesource.gpg /etc/apt/trusted.gpg.d/ && rm nodesource.gpg
sh -c 'echo "deb [signed-by=/etc/apt/trusted.gpg.d/nodesource.gpg] https://deb.nodesource.com/node_16.x $(lsb_release -s -c) main" > /etc/apt/sources.list.d/nodesource.list'
# Install the current versions of Azure Functions Core Tools, Node.js 16 LTS, netcat and python3-venv.
apt-get update -y && apt-get install azure-functions-core-tools nodejs netcat python3-venv -y

