#!/usr/bin/env sh

pbjs -t static-module -w commonjs -o proto/index.js proto/index.proto
pbts -o proto/index.d.ts proto/index.js
tsc
