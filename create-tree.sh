#!/bin/bash
set -e

# Path to file containing blob contents
path="${1}"

# Generate payload
payload=$( mktemp )
jq --null-input \
  --arg path "$path" \
  --arg blob_sha "$BLOB_SHA" \
  --arg base_tree "$BASE_TREE_SHA" \
  '{"tree": [{"path": $path, "mode": "100644", "type": "blob", "sha": $blob_sha}], "base_tree": $base_tree}' > $payload

# Create tree
response=$( curl --request POST \
  --url https://api.github.com/repos/$GITHUB_REPOSITORY/git/trees \
  --header "authorization: Bearer $GH_TOKEN" \
  --header 'content-type: application/json' \
  --data @$payload )

# Export environment variables with object ids
echo TREE_SHA=$( jq -r '.sha' <<< "${response}" ) >> $GITHUB_ENV
