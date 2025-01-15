'use strict';

const packageC = require('..');
const assert = require('assert').strict;

assert.strictEqual(packageC(), 'Hello from packageC');
console.info('packageC tests passed');
