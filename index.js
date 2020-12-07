const core = require('@actions/core');

const expand = require('./lib/expand');

async function setup() {
  try {
    // Get inputs
    const paths = core.getInput('paths');
    const commitMessage = core.getInput('commit-message');
    const ref = core.getInput('ref');

    // Expand paths to an array
    const expandedPaths = expand(paths);
    core.debug(`Received ${ paths.length } paths: ${ JSON.stringify(paths, null, 4) }`);

  } catch (e) {
    core.setFailed(e);
  }
}

module.exports = setup

if (require.main === module) {
  setup();
}
