import axios from 'axios';

const pkg = require('../package');

const github = axios.create({
  baseURL: `https://api.github.com/`,
  headers: {
    accept: `application/vnd.github.v3+json`,
    authorization: `bearer ${ process.env.GITHUB_TOKEN }`,
    'user-agent': `${ pkg.name }/${ pkg.version }`
  }
});

export default github;
