#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo -e "\nUsage '$0 <version>'\n"
    exit 1
fi

version=$1

url=http://artifactory.corp.linkedin.com:8081/artifactory/CNC/com/linkedin/voyager-web/voyager-web/${version}/voyager-web_prod_build-${version}.zip/\!/extended/sc-hashes.json
dest=sc-hashes-${version}.json

echo Downloading $url to $dest
status_code=$(curl --write-out %{http_code} --output $dest $url)
if [[ "$status_code" -ne 200 ]]; then
  echo Download failed with $status_code
  exit 1
fi