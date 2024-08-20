import * as core from '@actions/core';
import { graphql } from '@octokit/graphql';
import { RequestHeaders } from '@octokit/types';

export default function graphqlClient() {
  const token = core.getInput('GH_TOKEN', { required: true });

  const customHeaders: RequestHeaders = {};
  customHeaders.authorization = `token ${token}`;
  
  if (process.env.npm_package_name && process.env.npm_package_version) {
    customHeaders['user-agent'] = `${process.env.npm_package_name}/${process.env.npm_package_version}`;
  }

  return graphql.defaults({headers: customHeaders});
}
