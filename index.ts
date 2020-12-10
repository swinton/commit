import * as core from "@actions/core";

import getInput from "./lib/input";
import { getBlobsFromFiles } from "./lib/blob";
import github from "./lib/github-client";

export default async function run(): Promise<void> {
  try {
    // Get inputs
    const files = getInput("files");
    const baseDir = getInput("workspace", {
      default: process.env.GITHUB_WORKSPACE,
    });
    const commitMessage = getInput("commit-message");
    const ref = getInput("ref", { default: null });

    // Expand files to an array of "blobs", which will be created on GitHub via the create blob API
    const blobs = getBlobsFromFiles(files, { baseDir });
    core.debug(
      `Received ${blobs.length} blob${
        blobs.length === 1 ? "" : "s"
      }: ${blobs.map((blob) => blob.absoluteFilePath).join(", ")}`
    );

    // Save all the blobs, on GitHub
    for await (const blob of blobs) {
      await blob.save();
    }

    // TODO
    // Create tree
    // Via: POST https://api.github.com/repos/$GITHUB_REPOSITORY/git/trees

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
