const core = require('@actions/core');

const expand = require('./lib/expand');

async function setup() {
  try {
    // Get inputs
    const paths = core.getInput('paths');
    const baseDir = core.getInput('workspace');
    const commitMessage = core.getInput('commit-message');
    const ref = core.getInput('ref');

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
