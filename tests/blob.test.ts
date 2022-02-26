import fs from "fs";
import { join } from "path";
import { finished } from "stream";
import { promisify } from "util";

import { Repo } from "../lib/repo";
import { Blob } from "../lib/blob";

describe("Blob", () => {
  let repo: Repo;
  let blob: Blob;

  beforeEach(() => {
    repo = new Repo("foo/bar");
    blob = new Blob(repo, __dirname, "fixtures/blob.txt");
  });

  test("mode", () => {
    expect(blob.mode).toBe("100644");
  });

  test("path", () => {
    expect(blob.path).toBe("fixtures/blob.txt");
  });

  test("stream", async () => {
    const source = blob.stream;
    const dest = fs.createWriteStream('rando.json');
    await promisify(finished)(source.pipe(dest));
    expect(
      JSON.parse(fs.readFileSync(dest.path.toString()).toString())
    ).toEqual(
      JSON.parse(
        fs
          .readFileSync(join(__dirname, "fixtures", "blob.payload.json"))
          .toString()
      )
    );
    fs.rmSync('rando.json');
  });
});
