import { describe, jest, beforeEach, it, expect} from '@jest/globals';

import * as core from '@actions/core';
import client from '../src/github-client';

jest.mock('@actions/core');
const mockGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

describe('GitHub Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInput.mockImplementation((name, options) => {
      if (name === 'GH_TOKEN') return 'fake-token';
      return '';
    });
  });

  it ('should read GH_TOKEN from input', async () =>{
    expect(client()).toBeDefined();
    expect(mockGetInput).toHaveBeenCalledWith('GH_TOKEN', { required: true });
  });

  it('should set user-agent', async()=> {
    expect(client().endpoint.DEFAULTS.headers).toHaveProperty("user-agent", "@ryancyq/signed-commit/3.0.0")
  });
});

