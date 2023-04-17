import Resource from "./resource";

import { Repo } from "./repo";
import { Blob } from "./blob";

export class Tree extends Resource {
  sha: string;

  constructor(
    readonly repo: Repo,
    readonly blobs: Blob[],
    readonly parentOid?: string
  ) {
    super();
  }

  async save(): Promise<void> {
    // Save all the blobs
    for await (const blob of this.blobs) {
      await blob.save();
      this.debug(String(blob.stream.readableLength));
    }

    // Save the tree
    // Via: POST https://api.github.com/repos/$GITHUB_REPOSITORY/git/trees
    const response = await this.github.post(
      `repos/${this.repo.nameWithOwner}/git/trees`,
      {
        tree: this.blobs.map((blob) => {
          return {
            path: blob.path,
            mode: blob.mode,
            type: blob.type,
            sha: blob.sha,
          };
        }),
        base_tree: this.parentOid,
        },
        {
          maxBodyLength: 100000000, //100MB GitHub FileSizeLimit
          maxContentLength: 100000000,
        }
    );

    this.sha = response.data.sha;
    this.debug(`Tree: ${this.sha}`);
  }
}
