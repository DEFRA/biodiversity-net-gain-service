'use strict';

const bngMessaging = require('..');
const assert = require('assert').strict;

assert.strictEqual(bngMessaging(), 'Hello from bngMessaging');
console.info('bngMessaging tests passed');
