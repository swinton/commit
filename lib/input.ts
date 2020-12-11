import * as core from "@actions/core";

export interface InputOptions extends core.InputOptions {
  /** Optional. Default value to use for an input option if the option is not set. */
  default?: string | null;
}

export default function getInput(
  name: string,
  options: InputOptions = {}
): string | null {
  const value = core.getInput(name, options);

  if (!value && options.default) {
    core.debug(`${name}: ${options.default}`);
    return options.default;
  }

  core.debug(`${name}: ${value}`);
  return value;
}
