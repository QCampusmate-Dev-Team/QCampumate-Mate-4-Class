'use strict';

const fixtures = require('..');
const assert = require('assert').strict;

assert.strictEqual(fixtures(), 'Hello from fixtures');
console.info("fixtures tests passed");
