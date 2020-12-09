import * as core from '@actions/core';

import getInput from './lib/input';
import getCreateBlobRequestBodyStreams from './lib/create-blob-request-body-streams';

export default async function run() : Promise<void> {
  try {
    // Get inputs
    const paths = getInput('paths');
    const baseDir = getInput('workspace', { default: process.env.GITHUB_WORKSPACE });
    const commitMessage = getInput('commit-message');
    const ref = getInput('ref', { default: null });

    // Expand paths to an array of 'create blob request body' streams
    // We will use this array to efficiently stream file contents to GitHub's
    // create blobs API
    const streams = getCreateBlobRequestBodyStreams(paths, { baseDir });
    core.debug(`Received ${ streams.length } paths: ${ streams.join(', ') }`);
  } catch (e) {
    core.setFailed(e);
  }
};

run();
