import Resource from "./resource";
import { Repo } from "./repo";

export class Ref extends Resource {
  private prefix: string;
  private name: string;
  private commitOid: string;
  private treeOid: string;
  constructor(readonly repo: Repo, readonly ref: string) {
    super();
  }

  async save(): Promise<void> {
    throw new Error("Not implemented");
  }

  get fullyQualifiedName(): string {
    return this.prefix + this.name;
  }

  async load(): Promise<void> {
    type ResponseShape = {
      data: {
        repository: {
          ref: {
            name: string;
            prefix: string;
            commit: {
              oid: string;
              tree: {
                oid: string;
              };
            };
          };
        };
      };
    };

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
    this.name = (response.data as ResponseShape).data.repository.ref.name;
    this.prefix = (response.data as ResponseShape).data.repository.ref.prefix;
    this.commitOid = (response.data as ResponseShape).data.repository.ref.commit.oid;
    this.treeOid = (response.data as ResponseShape).data.repository.ref.commit.tree.oid;
    this.debug(
      `Ref: ${this.fullyQualifiedName}, prefix: ${this.prefix}, commitOid: ${this.commitOid}, treeOid: ${this.treeOid}`
    );
  }
}
