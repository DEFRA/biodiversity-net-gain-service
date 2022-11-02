# Manual Local Development Environment Configuration

## Prerequisites

* [Microsoft Visual Studio Code](https://code.visualstudio.com/) with the following extensions installed:
  * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  * [Standard JS](https://marketplace.visualstudio.com/items?itemName=standard.vscode-standard)
* [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
* [Azure Command Line Interface](https://docs.microsoft.com/en-us/cli/azure/)

## Install Git Hook For detect-secrets

[detect-secrets](https://github.com/Yelp/detect-secrets) is used to reduce the risk of secrets being committed to a code repository.
 To configure a git pre-commit hook that runs detect-secrets for an existing cloned repository, issue the following command from the
 root of this repository:

 ```sh
npm run install-detect-secrets
 ```

This will create a Software/python/virtual-envs/bng directory structure containing a Python virtual environment in the home directory
of the user that issues the command.

To configure the pre-commit hook for all future cloned repositories on the development machine, issue the following commands:

```sh
git config --global init.templateDir ~/.git-template
pre-commit init-templatedir ~/.git-template
```

Please consult [pre-commit](https://pre-commit.com/) documentation for further information.

For the git pre-commit hook to function the Python virtual environment **must** be activated. This can be achieved by issuing a command of the following form in the shell
where git push commands are issued (the path in angled brackets **MUST** be changed to reflect your local environent):

```sh
source <</path/to/bng/virtual environment>>/bin/activate
```

For convenience this command can be placed in a shell initialisation file such as .bashrc. Visual Studio Code development container configuration within this repository
uses this approach.

## Initialise And Configure The Mono-Repository

Issue the following command from the root directory of your local repository:

```sh
npm i
```

This will perform initialisation and configuration activities associated with the top level of the mono-repository and each Lerna package within it.

## Configuration

Consult the [containerisation](./containerisation.md) document and follow the Getting Started instructions within.
