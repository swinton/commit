import axios from "axios";
import pkginfo from "pkginfo";

pkginfo(module, "name", "version");

const github = axios.create({
  baseURL: `https://api.github.com/`,
  headers: {
    accept: `application/vnd.github.v3+json`,
    authorization: `bearer ${process.env.GH_TOKEN}`,
    "user-agent": `${module.exports.name}/${module.exports.version}`,
  },
});

export default github;
