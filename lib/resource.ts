import { AxiosInstance } from "axios";
import github from "./github-client";

export default class Resource {
  protected github: AxiosInstance;
  constructor() {
    this.github = github;
  }
}
