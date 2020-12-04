function get-default-branch-ref {
  response=$( gh api graphql \
    --field owner=':owner' \
    --field repo=':repo' \
    --raw-field \
      query='query getDefaultBranchRef($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef {
            name
          }
        }
      }'
  )

  ref=$( jq -r '.data.repository.defaultBranchRef.name' <<< "${response}" )

  echo "refs/heads/$ref"
}

function inspect-ref {
  ref="$1"
  response=$( gh api graphql \
    --field owner=':owner' \
    --field repo=':repo' \
    --field ref="$ref" \
    --raw-field \
      query='query inspectRef($owner: String!, $repo: String!, $ref: String!) {
        repository(owner: $owner, name: $repo) {
          ref(qualifiedName: $ref) {
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

  head_sha=$( jq -r '.data.repository.ref.commit.oid' <<< "${response}" )
  tree_sha=$( jq -r '.data.repository.ref.commit.tree.oid' <<< "${response}" )
}
