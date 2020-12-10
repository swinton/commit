import Resource from "./resource";

export class Repo extends Resource {
  defaultBranchRef: string;
  constructor(readonly nameWithOwner: string) {
    super();
  }

  async save(): Promise<void> {
    throw new Error("Not implemented");
  }

  async load(): Promise<void> {
    const response = await this.github.get(`/repos/${this.nameWithOwner}`);
    this.defaultBranchRef = response.data.default_branch;
  }
}
