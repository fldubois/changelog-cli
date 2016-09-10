## Functions

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

> Initiliaze a new change log with a standard boilerplate.

##### Usage

```js
chlg.init(file, callback); [options]
```

##### Parameters

| Parameter  | Type(s)    | Required | Default        | Description                            |
| ---------- | ---------- | -------- | -------------- | -------------------------------------- |
| `file`     | `string`   | No       | `CHANGELOG.md` | The change log filename                |
| `callback` | `function` | **Yes**  |                | Callback invoke with an optional error |

[▲ Back to top](#commands)

---

### show

> Get the messages from the change log, optionaly filtered by dates, versions and/or sections.

##### Usage

```js
chlg.show(options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                                                  |
| ---------- | ---------- | -------- | ------- | ---------------------------------------------------------------------------- |
| `options`  | `object`   | No       | `{}`    | Additional options                                                           |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error and an object containing the messages |

##### Options

| Option     | Type(s)              | Default        | Description                                                             |
| ---------- | -------------------- | -------------- | ----------------------------------------------------------------------- |
| `file`     | `string`             | `CHANGELOG.md` | The change log filename                                                 |
| `releases` | `string`, `string[]` | `Unreleased`   | Versions filter (semver version/range, 'Unreleased', 'all' or 'latest') |
| `sections` | `string`, `string[]` | `all`          | Sections filter (section name or 'all')                                 |
| `from`     | `Date`, `string`     | `null`         | Filter all releases prior to this date                                  |
| `to`       | `Date`, `string`     | `null`         | Filter all releases after that date                                     |

[▲ Back to top](#commands)

---

### release

> Add a new release to the change log containing all current messages.

##### Usage

```js
chlg.release(release, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                                          |
| ---------- | ---------- | -------- | ------- | -------------------------------------------------------------------- |
| `release`  | `string`   | **Yes**  |         | Release number (semver version) or increment (major, minor or patch) |
| `options`  | `object`   | No       | `{}`    | Additional options                                                   |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error                               |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |
| `date` | `Date`, `string` | Current date   | Force a specific release date, default to the current date |

[▲ Back to top](#commands)

---

### insert

> Insert a new message in the specified section of the current release in the change log

##### Usage

```js
chlg.insert(section, message, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                            |
| ---------- | ---------- | -------- | ------- | -------------------------------------- |
| `section`  | `string`   | **Yes**  |         | The section name                       |
| `message`  | `string`   | **Yes**  |         | The message to insert                  |
| `options`  | `object`   | No       | `{}`    | Additional options                     |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |

[▲ Back to top](#commands)

---

### add

> Add a new message in the 'Added' section.

##### Usage

```js
chlg.add(message, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                  |
| ---------- | ---------- | -------- | ------- | -------------------------------------------- |
| `message`  | `string`   | **Yes**  |         | The message to insert in the 'Added' section |
| `options`  | `object`   | No       | `{}`    | Additional options                           |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error       |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |

[▲ Back to top](#commands)

---

### change

> Add a new message in the 'Changed' section.

##### Usage

```js
chlg.change(message, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                    |
| ---------- | ---------- | -------- | ------- | ---------------------------------------------- |
| `message`  | `string`   | **Yes**  |         | The message to insert in the 'Changed' section |
| `options`  | `object`   | No       | `{}`    | Additional options                             |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error         |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |

[▲ Back to top](#commands)

---

### deprecate

> Add a new message in the 'Deprecated' section.

##### Usage

```js
chlg.deprecate(message, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                       |
| ---------- | ---------- | -------- | ------- | ------------------------------------------------- |
| `message`  | `string`   | **Yes**  |         | The message to insert in the 'Deprecated' section |
| `options`  | `object`   | No       | `{}`    | Additional options                                |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error            |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |

[▲ Back to top](#commands)

---

### remove

> Add a new message in the 'Removed' section.

##### Usage

```js
chlg.remove(message, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                    |
| ---------- | ---------- | -------- | ------- | ---------------------------------------------- |
| `message`  | `string`   | **Yes**  |         | The message to insert in the 'Removed' section |
| `options`  | `object`   | No       | `{}`    | Additional options                             |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error         |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |

[▲ Back to top](#commands)

---

### fix

> Add a new message in the 'Fixed' section.

##### Usage

```js
chlg.fix(message, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                  |
| ---------- | ---------- | -------- | ------- | -------------------------------------------- |
| `message`  | `string`   | **Yes**  |         | The message to insert in the 'Fixed' section |
| `options`  | `object`   | No       | `{}`    | Additional options                           |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error       |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |

[▲ Back to top](#commands)

---

### security

> Add a new message in the 'Security' section.

##### Usage

```js
chlg.security(message, options, callback);
```

##### Parameters

| Parameter  | Type(s)    | Required | Default | Description                                     |
| ---------- | ---------- | -------- | ------- | ----------------------------------------------- |
| `message`  | `string`   | **Yes**  |         | The message to insert in the 'Security' section |
| `options`  | `object`   | No       | `{}`    | Additional options                              |
| `callback` | `function` | **Yes**  |         | Callback invoke with an optional error          |

##### Options

| Option | Type(s)          | Default        | Description                                                |
| ------ | ---------------- | -------------- | ---------------------------------------------------------- |
| `file` | `string`         | `CHANGELOG.md` | The change log filename                                    |

[▲ Back to top](#commands)
