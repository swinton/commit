import Resource from "./resource";

import { Repo } from "./repo";
import { Blob } from "./blob";

export class Tree extends Resource {
  blobs: Blob[];
  constructor(repo: Repo, blobs: Blob[]) {
    super();
    this.blobs = blobs;
  }

  async save(): Promise<void> {
    // Save all the blobs
    for await (const blob of this.blobs) {
      await blob.save();
    }

    // Save the tree
    // Via: POST https://api.github.com/repos/$GITHUB_REPOSITORY/git/trees
  }
}
