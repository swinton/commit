import axios from "axios";
import getInput from "./input";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../package.json");

const token = getInput("token");

const github = axios.create({
  baseURL: `https://api.github.com/`,
  headers: {
    accept: `application/vnd.github.v3+json`,
    authorization: `bearer ${token}`,
    "user-agent": `${pkg.name}/${pkg.version}`,
  },
});

export default github;
