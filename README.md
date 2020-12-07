# Commit
> :white_check_mark: Create a _verified_ commit with GitHub Actions

## About
This action allows you to create a commit with GitHub Actions. Commits created with this actions will be marked as _verified_.

![image](https://user-images.githubusercontent.com/27806/101197362-a2ed0980-3627-11eb-9afb-bc8b9bcd0345.png)

## Usage
In your workflow, to commit a file `./myfile`, include a step like this:

```yaml
    - name: Commit file
      uses: swinton/commit@v2
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        paths: |
          myfile
        commit-message: Committing ./myfile
        ref: refs/heads/my-branch
```

Note, the `GH_TOKEN` environment variable is _required_, since commits are created using GitHub's [Git Database API](https://docs.github.com/rest/reference/git).

To commit multiple files in a single commit, pass each file on a newline to the `paths` input:

```yaml
    - name: Commit files
      uses: swinton/commit@v2
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        paths: |
          path/to/myfile1
          path/to/myfile2
          path/to/myfile3
        commit-message: Committing files
        ref: refs/heads/my-branch
```

## Inputs
The following inputs are _required_:

- `paths`: Newline-separated list of filesystems path of files to be committed, relative to root of repository, e.g. <pre>myfile1<br>myfile2<br>...<br>myfileN</pre>
- `commit-message`: Commit message to be used, e.g. `Add ./myfile`
- `ref`: Fully qualified name of reference to be updated with commit, e.g. `refs/heads/production`. This reference _must_ already exist. Defaults to the repository's default branch ref.

## Outputs
This action provides the following outputs:

- `commit-sha`: SHA of created commit
