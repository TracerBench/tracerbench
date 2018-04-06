'use strict';

let QUnit = require('qunit');
let fixturify = reqiure('fixturify');

const { test } = QUnit;

QUnit.module('cli', function(hooks) {
  test('first cli test', function(assert) {
    assert.expect(1);

    assert.ok(true);
  });

  test('fail', function(assert) {
    assert.ok(false);
  });
});
