import Resource from "./resource";
import { Repo } from "./repo";
import { Tree } from "./tree";

export class Commit extends Resource {
  sha: string;
  constructor(
    readonly repo: Repo,
    readonly tree: Tree,
    readonly message: string,
    readonly parents: string[]
  ) {
    super();
  }

  async save(): Promise<void> {
    // Save the tree first
    await this.tree.save();

    // Save the commit
    // Via: POST https://api.github.com/repos/$GITHUB_REPOSITORY/git/commits
    const response = await this.github.post(
      `/repos/${this.repo.nameWithOwner}/git/commits`,
      { //data-body
        message: this.message,
        tree: this.tree.sha,
        parents: this.parents,
      },
      { //config
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    this.sha = response.data.sha;
    this.debug(`Commit: ${this.sha}`);
  }
}
