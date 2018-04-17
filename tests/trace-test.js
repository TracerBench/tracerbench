'use strict';

const QUnit = require('qunit');
const fixturify = require('fixturify');
const Trace = require('../dist/index.cjs').Trace;

const { test } = QUnit;

QUnit.module('Trace', function(hooks) {
  test('class exists in module', function(assert) {
    assert.expect(1);

    assert.ok(typeof Trace !== 'undefined', 'Trace class exists in Profile module');
  });
});
