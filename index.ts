import * as core from '@actions/core';

import getInput from './lib/input';
import expand from './lib/expand';

export default async function setup() : Promise<void> {
  try {
    // Get inputs
    const paths = getInput('paths');
    const baseDir = getInput('workspace', { default: process.env.GITHUB_WORKSPACE });
    const commitMessage = getInput('commit-message');
    const ref = getInput('ref', { default: null });

    // Expand paths to an array
    const expandedPaths = expand(paths, { baseDir });
    core.debug(`Received ${ expandedPaths.length } paths: ${ expandedPaths.join(', ') }`);

  } catch (e) {
    core.setFailed(e);
  }
}

if (require.main === module) {
  setup();
}
