#!/bin/sh

local_settings_file="local.settings.json"

if [ ! -L ${local_settings_file} ] && [ ! -f ${local_settings_file} ]; then
  cp ../../docker/azure-services/${local_settings_file}.template  ${local_settings_file}
  echo Created ${local_settings_file} file with Azurite connectivity
elif [ -L ${local_settings_file} ]; then
  echo ${local_settings_file} symbolic link exists
else
  echo ${local_settings_file} file exists
fi
