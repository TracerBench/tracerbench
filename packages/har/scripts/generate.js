#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const json2ts = require('json-schema-to-typescript');
const schemas = require('@krisselden/har-schema');

const outfile = path.resolve(__dirname, '..', 'index.d.ts');

json2ts
  .compile(makeRefsLocal('har', schemas), 'Archive')
  .then(ts => fs.writeFileSync(outfile, ts));

function makeRefsLocal(rootKey, schemas) {
  let keys = Object.keys(schemas);

  let newRefByOld = new Map();
  keys.forEach(key => {
    let oldRef = schemas[key].$id;
    newRefByOld.set(oldRef, `#/definitions/${key}`);
  });

  let root;
  let definitions = {};
  keys.forEach(key => {
    let schema = JSON.parse(
      JSON.stringify(schemas[key], (key, value) => {
        if (key === '$ref') {
          return newRefByOld.get(value);
        } else if (key === '$id') {
          return;
        }
        return value;
      })
    );
    if (key === rootKey) {
      root = schema;
    } else {
      definitions[key] = schema;
    }
  });
  root.definitions = definitions;
  return root;
}
