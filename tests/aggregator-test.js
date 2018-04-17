'use strict';

const QUnit = require('qunit');
const fixturify = require('fixturify');
const Aggregator = require('../dist/index.cjs').Aggregator;

const { test } = QUnit;

QUnit.module('Aggregator', function(hooks) {
  test('class exists in module', function(assert) {
    assert.expect(1);

    assert.ok(typeof Aggregator !== 'undefined', 'Aggregator class exists in Profile module');
  });
});
