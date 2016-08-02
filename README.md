# changelog-cli

> Simple command line interface to edit CHANGELOG files according to [keepachangelog.com](http://keepachangelog.com/) rules.

## Command line usage

* Install `changelog-cli` (global installation is recommended for command line usage)

```
$ npm install --global git+https://fldubois@github.com/changelog-cli.git
```

* Start using the command line interface

```
$ chlg init
$ chlg add "New awesome feature"
$ chlg release 1.0.0
```

## Programmatic usage

* Install `changelog-cli` in your project

```
$ npm install --save-dev git+https://fldubois@github.com/changelog-cli.git
```

* Start using the API

```js
'use strict';

var chlg = require('changelog-cli');

chlg.init(function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Changelog initialized');
  }
});
```

## Commands

### init

> Create a new change log file with a standard template

#### Usage

```
$ chlg init [options]
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### show

> Show the change list of a specific release

#### Usage

```
$ chlg show [options] <release>
```

##### Options

| Short | Long         | Default        | Description                     |
| ----- | ------------ | -------------- | ------------------------------- |
| `-f`  | `--file`     | `CHANGELOG.md` | The change log filename         |
| `-r`  | `--release`  | `Unreleased`   | Release version to show         |
| `-s`  | `--section`  | `all`          | Changes section to show         |
| `-F`  | `--format`   | `raw`          | Ouput format                    |
|       | `--from`     |                | Filter release before this date |
|       | `--to`       |                | Filter release after this date  |
| `-C`  | `--no-color` |                | Disable ouput colors            |

### release

> Set all current changes under a new version

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |
| `-d`  | `--date` | Current date   | Set the release date    |

### insert

> Insert a new change in the log file

#### Usage

```
$ chlg insert [options] <section> <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### add

> Add a new feature in current changes

#### Usage

```
$ chlg add [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### change

> Point out a change in an existing functionality

#### Usage

```
$ chlg change [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### deprecate

> Tag a feature as deprecated for the upcoming release

#### Usage

```
$ chlg deprecate [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### remove

> Point out a feature deleted in the upcoming release

#### Usage

```
$ chlg remove [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### fix

> Add a bug fix to changes list

#### Usage

```
$ chlg fix [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

### security

> Invite users to upgrade in case of vulnerabilities

#### Usage

```
$ chlg security [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

## License

See [License](LICENSE)
