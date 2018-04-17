'use strict';

const QUnit = require('qunit');
const fixturify = require('fixturify');
const Profile = require('../dist/index.cjs');

const { test } = QUnit;

QUnit.module('Profile', function(hooks) {
  test('Profile module is defined', function(assert) {
    assert.expect(1);

    assert.ok(typeof Profile !== undefined, 'Profile is defined');
  });

  test('Profile module exports API', function(assert) {
    assert.expect(1);

    assert.deepEqual(
      Object.keys(Profile),
      ['loadTrace', 'Trace', 'CpuProfile', 'Aggregator', 'Reporter', 'CLI'],
      'API is defined'
    );
  });
});
