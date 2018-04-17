'use strict';

const QUnit = require('qunit');
const fixturify = require('fixturify');
const CpuProfile = require('../dist/index.cjs').CpuProfile;

const { test } = QUnit;

QUnit.module('CpuProfile', function(hooks) {
  test('class exists in module', function(assert) {
    assert.expect(1);

    assert.ok(typeof CpuProfile !== 'undefined', 'CpuProfile class exists in Profile module');
  });
});
