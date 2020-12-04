#!/bin/bash
set -e

# Generate payload
payload=$( mktemp )
jq --null-input \
  --arg sha "$COMMIT_SHA" \
  '{"sha": $sha}' > $payload

# Update ref
response=$( curl --silent --request PATCH \
  --url https://api.github.com/repos/$GITHUB_REPOSITORY/git/$REF \
  --header "authorization: Bearer $GH_TOKEN" \
  --header "content-type: application/json" \
  --data @$payload )
