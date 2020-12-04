#!/bin/bash
set -e

# Ref to inspect
ref="${1}"

# Get default branch ref if ref is empty
[[ -z "$ref" ]] && ref=$( get-default-branch-ref )

# Inspect ref
inspect-ref "$ref"

# Export environment variables with object ids
echo REF=$ref >> $GITHUB_ENV
echo HEAD_SHA=$head_sha >> $GITHUB_ENV
echo BASE_TREE_SHA=$tree_sha >> $GITHUB_ENV
