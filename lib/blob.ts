import * as fs from "fs";
import { Readable } from "stream";
import { join } from "path";
import { Base64Encode } from "base64-stream";
import MultiStream from "multistream";
import Resource from "./resource";
import { Repo } from "./repo";

export class Blob extends Resource {
  readonly type: string = "blob";
  readonly absoluteFilePath: string;
  readonly mode: string;
  sha: string;

  constructor(
    readonly repo: Repo,
    readonly baseDir: string,
    readonly file: string
  ) {
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
    const streams: Readable[] = [
      Readable.from('{"encoding":"base64","content":"'),
      fs.createReadStream(this.absoluteFilePath).pipe(new Base64Encode()),
      Readable.from('"}'),
    ];

    // Produces the JSON body as a stream, so that we don't have to read (
    // potentially very large) files into memory
    return new MultiStream(streams);
  }

  get path(): string {
    return this.file;
  }

  async save(): Promise<void> {
    const response = await this.github.post(
      `/repos/${this.repo.nameWithOwner}/git/blobs`,
      this.stream
    );
    this.sha = response.data.sha;
    this.debug(`Sha for blob ${this.file}: ${this.sha}.`);
  }
}

export interface Options {
  /** Optional. Default base dir to use when expanding a set of files. */
  baseDir?: string;
}

export function getBlobsFromFiles(
  repo: Repo,
  files: string,
  options: Options = {}
): Blob[] {
  const { baseDir } = options;
  return files
    .trim()
    .split("\n")
    .map((file) => new Blob(repo, baseDir, file));
}
