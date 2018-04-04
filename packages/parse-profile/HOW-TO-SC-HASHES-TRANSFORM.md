# SC-HASHES-TRANSFORM

## Usage

`# node sc-hashes-transform.js <sc-hashes.json file> <profile.json file>`

This will output the transformed profile.json to stdout.

## Where to get sc-hashes.json

When you get the trace for voyager-web, inspect the html and look for a meta tag with the name, "serviceVersion".

`<meta name="serviceVersion" content="1.1.5393" />`

The `sc-hashes.json` files are in artifactory with the deployable for voyager-web. Kris Selden (@kselden) has created
a script to download this easily.

- `# ./download-sc-hashes.sh <version>`
  - e.g., `./download-sc-hashes.sh 1.1.5393`
  - This will generate a sc-hashes-<version>.json file.
