import Resource from "./resource";
import { Repo } from "./repo";

export class Ref extends Resource {
  private prefix: string;
  private commitOid: string;
  private treeOid: string;
  constructor(readonly repo: Repo, readonly ref: string) {
    super();
  }

  async save(): Promise<void> {
    throw new Error("Not implemented");
  }

  async load(): Promise<void> {
    const response = await this.graphql(
      `query inspectRef($owner: String!, $name: String!, $ref: String!) {
        repository(owner: $owner, name: $name) {
          ref(qualifiedName: $ref) {
            name
            prefix
            commit: target {
              ... on Commit {
                oid
                tree {
                  oid
                }
              }
            }
          }
        }
      }`,
      { owner: this.repo.owner, name: this.repo.name, ref: this.ref }
    );
    this.debug(JSON.stringify(response.data, null, 4));
  }
}
