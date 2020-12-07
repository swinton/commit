function expand(paths) {
  return paths
    .trim()
    .split("\n");
}

module.exports = expand;

if (require.main === module) {
  console.log(expand(`path`));
  console.log(expand(`\npath1\npath2\npath3\n`));
}
