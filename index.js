const core = require('@actions/core');

const getInput = require('./lib/input');
const expand = require('./lib/expand');

async function setup() {
  try {
    // Get inputs
    const paths = getInput('paths');
    const baseDir = getInput('workspace', { default: process.env.GITHUB_WORKSPACE });
    const commitMessage = getInput('commit-message');
    const ref = getInput('ref');

    // Expand paths to an array
    const expandedPaths = expand(paths, { baseDir });
    core.debug(`Received ${ expandedPaths.length } paths: ${ expandedPaths.join(', ') }`);

  } catch (e) {
    core.setFailed(e);
  }
}

module.exports = setup

if (require.main === module) {
  setup();
}
