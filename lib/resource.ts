import { AxiosInstance, AxiosResponse } from "axios";
import * as core from "@actions/core";

import github from "./github-client";

export interface Saveable {
  save(): Promise<void>;
}

export default abstract class Resource implements Saveable {
  protected debug: (message: string) => void;
  protected github: AxiosInstance;
  constructor() {
    this.debug = core.debug;
    this.github = github;
  }

  protected graphql(
    query: string,
    variables: Record<string, unknown>
  ): Promise<AxiosResponse<unknown>> {
    const body: Record<string, unknown> = {
      query,
      variables,
    };
    return this.github.post(`/graphql`, body);
  }

  abstract save(): Promise<void>;
}
