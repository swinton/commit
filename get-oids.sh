#!/bin/bash
set -e

# GraphQL query to get default branch ref's head commit SHA and tree SHA
response=$( gh api graphql \
  --field owner=':owner' \
  --field repo=':repo' \
  --raw-field \
    query='query repoContents($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        defaultBranchRef {
          name
          commit: target {
            ... on Commit {
              oid
              tree {
                oid
              }
            }
          }
        }
      }
    }'
)

# Export environment variables with object ids
echo HEAD_SHA=$( jq -r '.data.repository.defaultBranchRef.commit.oid' <<< "${response}" ) >> $GITHUB_ENV
echo TREE_SHA=$( jq -r '.data.repository.defaultBranchRef.commit.tree.oid' <<< "${response}" ) >> $GITHUB_ENV
