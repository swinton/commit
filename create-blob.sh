#!/bin/bash
set -e

# Path to file containing blob contents
path="${1}"

# Encode blob contents
content=$( mktemp )
base64 -i "${path}" | jq --raw-input > $content

# Generate payload
payload=$( mktemp )
jq --null-input \
  --arg encoding "base64" \
  --argfile content "$content" \
  '{"content": $content, "encoding": $encoding}' > $payload

# Create blob
response=$( curl --request POST \
  --url https://api.github.com/repos/$GITHUB_REPOSITORY/git/blobs \
  --header "authorization: Bearer $GH_TOKEN" \
  --header 'content-type: application/json' \
  --data @$payload )

# Export environment variables with object ids
echo BLOB_SHA=$( jq -r '.sha' <<< "${response}" ) >> $GITHUB_ENV
