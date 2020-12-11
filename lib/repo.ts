import Resource from "./resource";

export class Repo extends Resource {
  readonly owner: string;
  readonly name: string;
  defaultBranchRef: string;
  constructor(readonly nameWithOwner: string) {
    super();
    const [owner, name] = this.nameWithOwner.split("/");
    this.owner = owner;
    this.name = name;
  }

  async save(): Promise<void> {
    throw new Error("Not implemented");
  }

  async load(): Promise<void> {
    const response = await this.github.get(`/repos/${this.nameWithOwner}`);
    this.defaultBranchRef = response.data.default_branch;
  }
}
