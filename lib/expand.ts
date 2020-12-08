import { basename } from "path";

const { join } = require('path');

export interface ExpandOptions {
  /** Optional. Default base dir to use when expanding a set of paths. */
  baseDir?: string
};

export default function expand(paths: string, options: ExpandOptions = {}): Array<string> {
  const { baseDir } = options;
  return paths
    .trim()
    .split("\n")
    .map(path => join(baseDir, path));
}
