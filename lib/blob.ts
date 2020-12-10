import * as fs from "fs";
import { Readable, Transform } from "stream";
import { join } from "path";
import * as core from "@actions/core";
import * as MultiStream from "multistream";
import Resource from "./resource";

/**
 * Encodes chunks in a stream to base64
 */
const base64Transformer = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString("base64"));
    callback();
  },
});

export class Blob extends Resource {
  readonly absoluteFilePath: string;
  readonly mode: string;
  sha: string;

  constructor(readonly baseDir: string, readonly file: string) {
    super();
    this.absoluteFilePath = join(baseDir, file);
    // Reject files that don't exist
    if (!fs.existsSync(this.absoluteFilePath)) {
      throw new Error(`File does not exist: ${this.absoluteFilePath}.`);
    }
    // Set the file's mode, this should be represented as an octal string
    this.mode = fs.statSync(this.absoluteFilePath).mode.toString(8);
  }

  /**
   * Produces a stream that conforms to the shape expected
   * by the POST /repos/{owner}/{repo}/git/blobs GitHub API
   *
   * For example, streams produced by this class will resolve to a shape like:
   *  {
   *    "encoding": "base64",
   *    "content": "SGFsZiBtZWFzdXJlcyBhcmUgYXMgYmFkIGFzIG5vdGhpbmcgYXQgYWxsLg=="
   *  }
   *
   * See: https://docs.github.com/rest/reference/git#create-a-blob
   */
  get stream(): Readable {
    // Produces the JSON body as a stream, so that we don't have to read (
    // potentially very large) files into memory
    return new MultiStream([
      Readable.from('{"encoding":"base64","content":"'),
      fs.createReadStream(this.absoluteFilePath).pipe(base64Transformer),
      Readable.from('"}'),
    ]);
  }

  async save(): Promise<void> {
    const response = await this.github.post(
      `/repos/${process.env.GITHUB_REPOSITORY}/git/blobs`,
      this.stream
    );
    this.sha = response.data.sha;
    core.debug(`Sha for blob ${this.file}: ${this.sha}.`);
  }
}

export interface Options {
  /** Optional. Default base dir to use when expanding a set of files. */
  baseDir?: string;
}

export function getBlobsFromFiles(
  files: string,
  options: Options = {}
): Blob[] {
  const { baseDir } = options;
  return files
    .trim()
    .split("\n")
    .map((file) => new Blob(baseDir, file));
}
