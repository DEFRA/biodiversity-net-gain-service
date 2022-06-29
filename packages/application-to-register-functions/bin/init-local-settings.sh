#!/bin/sh

local_settings_file="local.settings.json"

if [ ! -L ${local_settings_file} ]; then
  ln -s ../../docker/azure-services/${local_settings_file}  ${local_settings_file}
   echo Created ${local_settings_file} symbolic link
else
  echo ${local_settings_file} symbolic link exists
fi
