# changelog-cli

> Simple command line interface to edit CHANGELOG files according to [keepachangelog.com](http://keepachangelog.com/) rules.

## Commands

### init

> Create a new change log file with a standard template

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### show

> Show the change list of a specific release

##### Options

| Short | Long        | Default        | Description             |
| ----- | ----------- | -------------- | ----------------------- |
| `-f`  | `--file`    | `CHANGELOG.md` | The change log filename |
| `-r`  | `--release` | `Unreleased`   | Release version to show |
| `-s`  | `--section` | `all`          | Changes section to show |

### release

> Set all current changes under a new version

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### add

> Add a new feature in current changes

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

## License

See [License](LICENSE)
