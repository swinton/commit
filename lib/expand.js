const { join } = require('path');

function expand(paths, options = { baseDir: process.env.GITHUB_WORKSPACE }) {
  const { baseDir } = options;
  return paths
    .trim()
    .split("\n")
    .map(path => join(baseDir, path));
}

module.exports = expand;

if (require.main === module) {
  console.log(expand(`zen.txt`, { baseDir: `/home/scratch` }));
  console.log(expand(`\npath1\npath2\npath3\n`));
}
