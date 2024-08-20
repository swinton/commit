import * as core from '@actions/core';
import { GraphqlResponseError } from '@octokit/graphql';
import { Repository, CreateCommitOnBranchPayload, MutationCreateCommitOnBranchArgs, CommittableBranch, FileChanges } from '@octokit/graphql-schema';

import client from './github-client';

export async function getRepository(owner: string, repo: string): Promise<Repository> {
  try{
    const query = `
        query($owner: String!, $repo: String) {
          repository(owner: $owner, name: $repo) {
            id
            defaultBranchRef {
              name
            }
          }
        }
      `;
    const { repository } = await client()<{ repository: Repository}>(
      query,
      {
        owner: owner,
        repo: repo
      }
    );
    
    return repository;
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      const { query, variables } = error.request;
      core.error(error.message);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      core.debug(`Request failed, query: ${query}, variables: ${JSON.stringify(variables)}, data: ${error.data}`);
    }
    throw error;
  }
}

export async function createCommitOnBranch(branch: CommittableBranch, fileChanges: FileChanges): Promise<CreateCommitOnBranchPayload> {
  const commitMessage = core.getInput('commit-message', { required: true });
  const mutation =     `
      mutation($input: CreateCommitOnBranchInput!) {
      createCommitOnBranch(input: $input) {
        commit {
          id
        }
      }
    }`

  const input: MutationCreateCommitOnBranchArgs = {
    input: {
      branch,
      expectedHeadOid: undefined,
      message: {
        headline: commitMessage,
      },
      fileChanges
    }
  }
  const { createCommitOnBranch } = await client()<{ createCommitOnBranch: CreateCommitOnBranchPayload}>(mutation,input)
  return createCommitOnBranch;
}
