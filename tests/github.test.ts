import { describe, jest, beforeEach, it, expect} from '@jest/globals';
import fetchMock from "fetch-mock";

import * as core from '@actions/core';
import { graphql, GraphqlResponseError } from '@octokit/graphql';
import { Repository, CreateCommitOnBranchPayload, FileChanges, CommittableBranch } from '@octokit/graphql-schema';
import client from '../src/github-client';
import { getRepository, createCommitOnBranch } from '../src/github';

jest.mock('@actions/core');
const mockGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

jest.mock('../src/github-client')
const mockClient = client as jest.MockedFunction<typeof client>;

describe('GitHub API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.reset();
  });
  
  describe('getRepository', () => {
    it('should fetch repository details', async () => {
      mockClient.mockImplementation(() => {
        return graphql.defaults({
          request: {
            fetch: fetchMock.sandbox().post(
              "https://api.github.com/graphql",
              {
                data: {
                  repository:  {
                    id: 'repo-id',
                    defaultBranchRef: {
                      name: 'main',
                    },
                    __typename: 'Repository'
                  }
                }
              },
            ),
          },
        });
      });
      
      const repo = await getRepository('owner', 'repo');
      expect(repo).toHaveProperty('id', 'repo-id');
      expect(repo).toHaveProperty('defaultBranchRef.name', 'main');
    });

    it('should handle GraphqlResponseError', async () => {
      mockClient.mockImplementation(() => {
        return graphql.defaults({
          request: {
            fetch: fetchMock.sandbox().post(
              "https://api.github.com/graphql",
              {
                errors: [{ message: 'GraphQL error' }],
                data: null
              },
            ),
          },
        });
      });

      await expect(getRepository('owner', 'repo')).rejects.toThrow('GraphQL error');
      expect(core.error).toHaveBeenCalledWith("Request failed due to following response errors:\n - GraphQL error");
      expect(core.debug).toHaveBeenCalledWith(expect.stringMatching(/Request failed, query: [\s\S]*, variables: [\s\S]*, data: [\s\S]*/));
    });
  });

  describe('createCommitOnBranch', () => {
    it('should create a commit on the given branch', async () => {
      mockGetInput.mockImplementation((name, options) => {
        if (name === 'commit-message') return 'fake commit message';
        return '';
      });
      mockClient.mockImplementation(() => {
        return graphql.defaults({
          request: {
            fetch: fetchMock.sandbox().post(
              "https://api.github.com/graphql",
              {
                data: {
                  createCommitOnBranch: {
                    commit: {
                      id: 'commit-id',
                      __typename: 'Commit'
                    },
                    __typename: 'CreateCommitOnBranchPayload'
                  }
                }
              },
            ),
          },
        });
      });

      const fileChanges: FileChanges = {};
      const branch: CommittableBranch = {};
      const result = await createCommitOnBranch(branch, fileChanges);
      expect(result).toHaveProperty('commit.id', 'commit-id');
    });
  });
});

