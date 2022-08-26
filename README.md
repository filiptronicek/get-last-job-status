# get-last-job-status

A composite action which tells you the status of the last completed action. This is useful when you want to, for example, report that a job that has been failing since yesterday is now resolved, or that it's still an ongoing issue.

The repository also implements a similar technique for [Werft](https://github.com/csweichel/werft) - see [werft.js](werft.js).

## Example usage

### GitHub Actions

```yaml
name: Notify

on:
  push:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Get previous job's status
        id: lastrun
        uses: filiptronicek/get-last-job-status@main
      - name: Notification
        if: ${{ steps.lastrun.outputs.status == 'failed' }}
        run: echo "I failed last time :( !!!"
```

### Werft

```yaml
command:
  - bash
  - -c
  - |
    curl https://raw.githubusercontent.com/filiptronicek/get-last-job-status/main/werft.js -o wget.js
    node werft.js gitpod-ide-integration-tests-startup-main
```
