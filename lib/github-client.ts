import { join } from "path";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(join(__dirname, "..", "package.json"));

const github = axios.create({
  baseURL: `https://api.github.com/`,
  headers: {
    accept: `application/vnd.github.v3+json`,
    authorization: `bearer ${process.env.GH_TOKEN}`,
    "user-agent": `${pkg.name}/${pkg.version}`,
  },
});

export default github;
