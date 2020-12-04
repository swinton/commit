#!/bin/bash
set -e

# Commit messsage
message="${1}"

# Generate payload
payload=$( mktemp )
jq --null-input \
  --arg tree_sha "$TREE_SHA" \
  --arg parent_sha "$HEAD_SHA" \
  --arg message "$message" \
  '{"message": $message, "tree": $tree_sha, "parents": [$parent_sha]}' > $payload

# Create commit
response=$( curl --silent --request POST \
  --url https://api.github.com/repos/$GITHUB_REPOSITORY/git/commits \
  --header "authorization: Bearer $GH_TOKEN" \
  --header 'content-type: application/json' \
  --data @$payload )

# Get SHA of commit
commit_sha=$( jq -r '.sha' <<< "${response}" )

# Export environment variables with object ids
echo "COMMIT_SHA=$commit_sha" >> $GITHUB_ENV

# Set 'commit-sha' output
echo "::set-output name=commit-sha::$commit_sha"
