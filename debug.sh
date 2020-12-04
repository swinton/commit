#!/bin/bash
set -e

# export MESSAGE="chore: generate data.csv for $TODAY
# skip-checks: true"
# export SHA=$( git rev-parse data:data.csv )
# export CONTENTFILE=$( mktemp )
# export PAYLOADFILE=$( mktemp )
# cat data.csv | base64 | jq --raw-input > $CONTENTFILE
# jq --null-input \
#   --arg message "$MESSAGE" \
#   --argfile content "$CONTENTFILE" \
#   --arg sha "$SHA" \
#   --arg branch "data" \
#   '{"message": $message, "content": $content, "sha": $sha, "branch": $branch}' > $PAYLOADFILE

payload=$( mktemp )
jq --null-input \
  --arg encoding "base64" \
  '{"encoding": $encoding}' > $payload

cat $payload
