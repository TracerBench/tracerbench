'use strict';
const fs = require('fs');

const URL_REGEX_STRING = /"https:\/\/[^"]+\/sc\/h\/(br\/)?([^"\/]+)"/g;

function ScHashesTransformer(scHashesFile) {
  // This is a map of filename to hash value
  let fileToHash = JSON.parse(fs.readFileSync(scHashesFile, 'UTF8')).hashes;

  // Need to create the reverse map (hash to filename)
  let hashToFile = {};
  Object.keys(fileToHash)
    .forEach(file => {
      let hash = fileToHash[file];
      let currentFile = hashToFile[hash];
      if (currentFile) {
        if (file.length < currentFile.length) {
          hashToFile[hash] = file;
        }
      } else {
        hashToFile[hash] = file;
      }
    });
  this._hashToFile = hashToFile;
}

ScHashesTransformer.prototype = {
  transformFromString(profileEventsString) {
    return profileEventsString.replace(URL_REGEX_STRING, (match, p1, p2) => `"${this._hashToFile[p2]}"`);
  }
}

if (process.argv.length != 4) {
  console.error("Bad command line.");
  console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <sc-hashes json> <profile json>`);
  process.exit();
}

const profileFile = process.argv[3];
const profileString = fs.readFileSync(profileFile, 'UTF8');

const scHashesFile = process.argv[2];
const transformer = new ScHashesTransformer(scHashesFile);

console.log(JSON.stringify(JSON.parse(transformer.transformFromString(profileString)), null, 2));

