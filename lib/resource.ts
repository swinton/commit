import { AxiosInstance } from "axios";
import github from "./github-client";

export interface Saveable {
  save(): Promise<void>;
}

export default abstract class Resource implements Saveable {
  protected github: AxiosInstance;
  private route: string;
  constructor() {
    this.github = github;
  }

  abstract save(): Promise<void>;
}
