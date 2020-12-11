import * as core from "@actions/core";

import getInput from "./lib/input";
import { Repo } from "./lib/repo";
import { Ref } from "./lib/ref";
import { getBlobsFromFiles } from "./lib/blob";
import { Tree } from "./lib/tree";

export default async function run(): Promise<void> {
  try {
    // Get repo
    const repo = new Repo(process.env.GITHUB_REPOSITORY);
    await repo.load();

    // Get inputs
    const files = getInput("files");
    const baseDir = getInput("workspace", {
      default: process.env.GITHUB_WORKSPACE,
    });
    const commitMessage = getInput("commit-message");

    // Load ref details
    const ref = new Ref(
      repo,
      getInput("ref", { default: repo.defaultBranchRef })
    );
    await ref.load();

    // Expand files to an array of "blobs", which will be created on GitHub via the create blob API
    const blobs = getBlobsFromFiles(repo, files, { baseDir });
    core.debug(
      `Received ${blobs.length} blob${
        blobs.length === 1 ? "" : "s"
      }: ${blobs.map((blob) => blob.absoluteFilePath).join(", ")}`
    );

    // Create a tree
    const tree: Tree = new Tree(repo, blobs);
    await tree.save();

    // TODO
    // Create commit
    // Via: POST https://api.github.com/repos/$GITHUB_REPOSITORY/git/commits

    // TODO
    // Update ref
    // Via: PATCH https://api.github.com/repos/$GITHUB_REPOSITORY/git/$REF
  } catch (e) {
    core.setFailed(e);
  }
}

run();
