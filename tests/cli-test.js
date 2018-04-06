'use strict';

let QUnit = require('qunit');

const { test } = QUnit;

QUnit.module('cli', function(hooks) {
  QUnit.test('first cli test', function(assert) {
    assert.expect(1);

    assert.ok(true);
  });

  QUnit.test('fail', function(assert) {
    assert.ok(false);
  });
});
