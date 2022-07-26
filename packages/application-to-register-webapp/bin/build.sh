#!/bin/sh

npm run build:clean
npm run build:js
npm run build:copy-static
npm run build:css