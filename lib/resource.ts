import { AxiosInstance, AxiosResponse } from "axios";
import * as core from "@actions/core";

import github from "./github-client";

export interface Saveable {
  save(): Promise<void>;
}

export default abstract class Resource implements Saveable {
  protected debug: (message: string) => void;
  protected github: AxiosInstance;
  private route: string;
  constructor() {
    this.debug = core.debug;
    this.github = github;
  }

  abstract save(): Promise<void>;
}
