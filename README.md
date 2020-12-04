# Commit
> Create a commit with GitHub Actions

## :warning: Warning
This action is still in development and the experience is subject to change. Use at your own risk.

## About
This action allows you to create a commit with GitHub Actions. Commits created with this aciton will be marked as _verified_.

## Usage
In your workflow, to commit a file `./myfile`, include a step like this:

```yaml
    - name: Commit file
      uses: swinton/commit@v0
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        path: ./myfile
```

Note, the `GH_TOKEN` environment variable is required, since commits are created using GitHub's [Git Database API](https://docs.github.com/rest/reference/git).
