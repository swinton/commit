const core = require('@actions/core');

function getInput(name, options = {}) {
  const getInputDefaults = {
    required: false
  };
  const value = core.getInput(name, { ...getInputDefaults, ...options });

  if (!value && options.default) {
    core.debug(`${ name }: ${ options.default }`);
    return options.default;
  }

  core.debug(`${ name }: ${ value }`);
  return value;
}

module.exports = getInput;
