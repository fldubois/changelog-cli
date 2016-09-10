## Commands

* [init](#init)
* [show](#show)
* [release](#release)
* [insert](#insert)
* [add](#add)
* [change](#change)
* [deprecate](#deprecate)
* [remove](#remove)
* [fix](#fix)
* [security](#security)

---

### init

> Create a new change log file with a standard template

##### Usage

```
$ chlg init [options]
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)

---

### show

> Show the change list of a specific release

##### Usage

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

[▲ Back to top](#commands)

---

### release

> Set all current changes under a new version

##### Usage

```
$ chlg release [options] <release>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |
| `-d`  | `--date` | Current date   | Set the release date    |

[▲ Back to top](#commands)

---

### insert

> Insert a new change in the log file

##### Usage

```
$ chlg insert [options] <section> <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)

---

### add

> Add a new feature in current changes

##### Usage

```
$ chlg add [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)

---

### change

> Point out a change in an existing functionality

##### Usage

```
$ chlg change [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)

---

### deprecate

> Tag a feature as deprecated for the upcoming release

##### Usage

```
$ chlg deprecate [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)

---

### remove

> Point out a feature deleted in the upcoming release

##### Usage

```
$ chlg remove [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)

---

### fix

> Add a bug fix to changes list

##### Usage

```
$ chlg fix [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)

---

### security

> Invite users to upgrade in case of vulnerabilities

##### Usage

```
$ chlg security [options] <message>
```

##### Options

| Short | Long     | Default        | Description             |
| ----- | -------- | -------------- | ----------------------- |
| `-f`  | `--file` | `CHANGELOG.md` | The change log filename |

[▲ Back to top](#commands)
