import { finished } from "stream";
import { promisify } from "util";
import streams from "memory-streams";

import { Repo } from "../lib/repo";
import { Blob } from "../lib/blob";

describe("Blob", () => {
  let repo: Repo;
  let blob: Blob;

  beforeEach(() => {
    repo = new Repo("foo/bar");
    blob = new Blob(repo, __dirname, "fixtures/zen.txt");
  });

  test("mode", () => {
    expect(blob.mode).toBe("100644");
  });

  test("path", () => {
    expect(blob.path).toBe("fixtures/zen.txt");
  });

  test("stream", async () => {
    const source = blob.stream;
    const dest = new streams.WritableStream();
    await promisify(finished)(source.pipe(dest));
    expect(dest.toString()).toBe(
      '{"encoding":"base64","content":"S2VlcCBpdCBsb2dpY2FsbHkgYXdlc29tZS4K"}'
    );
  });
});
