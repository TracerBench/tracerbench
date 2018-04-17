'use strict';

const QUnit = require('qunit');
const fixturify = require('fixturify');
const Reporter = require('../dist/index.cjs').Reporter;

const { test } = QUnit;

QUnit.module('Reporter', function(hooks) {
  test('class exists in module', function(assert) {
    assert.expect(1);

    assert.ok(typeof Reporter !== 'undefined', 'Reporter class exists in Profile module');
  });
});
