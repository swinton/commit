# Commit
> :white_check_mark: Create a _verified_ commit with GitHub Actions

 ![](https://github.com/imjohnbo/commit/workflows/tests/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## About
This action allows you to create a commit with GitHub Actions. Commits created with this actions will be marked as _verified_.

![image](https://user-images.githubusercontent.com/27806/102705224-ab118f80-424a-11eb-94c5-ab7396ccba13.png)

## Usage
In your workflow, to commit a file `./myfile`, include a step like this:

```yaml
    - name: Commit file
      uses: imjohnbo/commit@v1
      with:
        files: |
          myfile
        commit-message: Committing ./myfile
        ref: refs/heads/my-branch
```

`imjohnbo/commit` only commits files that have changed.

To commit multiple files in a single commit, pass each file on a newline to the `files` input:

```yaml
    - name: Commit files
      uses: imjohnbo/commit@v1
      with:
        files: |
          path/to/myfile1
          path/to/myfile2
          path/to/myfile3
        commit-message: Committing files
        ref: refs/heads/my-branch
```

## Inputs
The `token` input is optional.

The following inputs are _required_:

- `files`: Newline-separated list of files to be committed, relative to root of repository, e.g. <pre>myfile1<br>myfile2<br>...<br>myfileN</pre>
- `commit-message`: Commit message to be used, e.g. `Add ./myfile`
- `ref`: Fully qualified name of reference to be updated with commit, e.g. `refs/heads/production`. This reference _must_ already exist. Defaults to the repository's default branch ref.

## Outputs
This action provides the following outputs:

- `commit-sha`: SHA of created commit
