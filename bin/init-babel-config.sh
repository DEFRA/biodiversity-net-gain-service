#!/bin/sh

# Jest 28 does not look for Babel configuration in directories above Jest configuration files (https://github.com/facebook/jest/issues/12768)
# Add a symbolic link to the root Babel configuration file in the same directory as the Jest configuration file in each package.
for package in `ls packages`
do
  if [[ ! -L "packages/${package}/babel.config.json" ]]; then
    ln -s ../../babel.config.json  packages/"${package}"/babel.config.json
    echo "Created packages/"${package}"/babel.config.json symbolic link"
  fi
done
