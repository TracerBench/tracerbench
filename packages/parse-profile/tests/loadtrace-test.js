'use strict';

const QUnit = require('qunit');
const fixturify = require('fixturify');
const loadTrace = require('../dist/index.cjs').loadTrace;

const { test } = QUnit;

QUnit.module('loadTrace', function(hooks) {
  test('function exists in module', function(assert) {
    assert.expect(1);

    assert.ok(typeof loadTrace !== 'undefined', 'loadTrace function exists in Profile module');
  });
});
