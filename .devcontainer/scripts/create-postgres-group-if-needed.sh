#!/bin/sh

if [ ${CREATE_POSTGRES_GROUP} = "1" ]; then
  groupmod -g 998 docker
  addgroup --system --gid 999 postgres
  echo Created postgres group with GID 999
else
  echo No instruction to create a postgres group has been found  
fi
