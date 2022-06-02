# Dockerfile inspired by https://github.com/klabbet/signalr-emulator.
FROM mcr.microsoft.com/dotnet/sdk:3.1-bullseye
RUN apt-get update -y && apt-get install -y lsb-release apt-utils && apt-get clean all && \
    # Install the Microsoft package signing key and repository.
    curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg && \
    install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/ && rm packages.microsoft.gpg && \
    sh -c 'echo "deb [arch=amd64 signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/debian/$(lsb_release -rs | cut -d'.' -f 1)/prod $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnetdev.list' && \
    # Install Nodesource package signing key and the Node.js 16 LTS repository.
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor > nodesource.gpg && \
    install -o root -g root -m 644 nodesource.gpg /etc/apt/trusted.gpg.d/ && rm nodesource.gpg && \
    sh -c 'echo "deb [signed-by=/etc/apt/trusted.gpg.d/nodesource.gpg] https://deb.nodesource.com/node_16.x $(lsb_release -s -c) main" > /etc/apt/sources.list.d/nodesource.list' && \
    # Install the current versions of Azure Functions Core Tools and Node.js 16 LTS.
    apt-get update -y && apt-get install azure-functions-core-tools nodejs -y
# Add a non-privileged user.
RUN useradd --shell /usr/sbin/nologin node
# Install and initialise the SignalR emulator.
WORKDIR /home/node/asrs-emulator
RUN dotnet tool install --tool-path /usr/local/bin Microsoft.Azure.SignalR.Emulator --version 1.0.0-preview1-10809 && asrs-emulator upstream init
# Prepare to run the Azure functions that:
# - process trusted files
# - perform SignalR negotiation using the emulator
WORKDIR /home/node/Projects/biodiversity-net-gain-service/packages/application-to-register-functions
COPY ./packages/application-to-register-functions/ProcessTrustedFile ProcessTrustedFile
# Overwrite the function which processes trusted files with a test double.
COPY ./docker/azure-services/test-doubles/ProcessTrustedFile/index.mjs ProcessTrustedFile/index.mjs
COPY ./packages/application-to-register-functions/SignalRNegotiate SignalRNegotiate
COPY ./packages/application-to-register-functions/package.json .
COPY ./packages/application-to-register-functions/host.json .
COPY ./docker/azure-services/local.settings.json .
# Ensure correct directory and file ownership by the unprivileged user.
RUN chown -R node:node /home/node
USER node
# Run the Azure Functions and start the SignalR emulator.
ENTRYPOINT (func start &) && cd /home/node/asrs-emulator && asrs-emulator start --ip 0.0.0.0