import * as core from '@actions/core';

import getInput from './lib/input';
import getCreateBlobRequestBodyStreams from './lib/create-blob-request-body-streams';
import github from './lib/github-client';

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
    core.debug(`Received ${ streams.length } stream${ streams.length === 1 ? '' : 's' }: ${ streams.map(stream => stream.path).join(', ') }`);

    // Create blobs using Git database API
    let blobs: {sha: string, path: string}[] = [];
    for await (let stream of streams) {
      const response = await github.post(`/repos/${ process.env.GITHUB_REPOSITORY }/git/blobs`, stream);
      blobs.push({
        path: stream.path,
        sha: response.data.sha
      });
    }
    core.debug(`Created ${ blobs.length } blob${ blobs.length === 1 ? '' : 's' }: ${ JSON.stringify(blobs, null, 4) }`);
  } catch (e) {
    core.setFailed(e);
  }
};

run();
