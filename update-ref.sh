#!/bin/bash
set -e

# Ref to update
ref="${1}"

# Generate payload
payload=$( mktemp )
jq --null-input \
  --arg sha "$COMMIT_SHA" \
  '{"sha": $sha}' > $payload

# Update ref
response=$( curl --request PATCH \
  --url https://api.github.com/repos/$GITHUB_REPOSITORY/git/refs/$ref \
  --header "authorization: Bearer $GH_TOKEN" \
  --header "content-type: application/json" \
  --data @$payload )
