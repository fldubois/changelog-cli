# changelog-cli

[![Build Status](https://travis-ci.org/fldubois/changelog-cli.svg?branch=master)](https://travis-ci.org/fldubois/changelog-cli)
[![dependencies Status](https://david-dm.org/fldubois/changelog-cli/status.svg)](https://david-dm.org/fldubois/changelog-cli)
[![devDependencies Status](https://david-dm.org/fldubois/changelog-cli/dev-status.svg)](https://david-dm.org/fldubois/changelog-cli?type=dev)

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

For more informations on command line usage, see [the documentation](docs/CLI.md).

#### Tip for NPM scripts

With a combination of this module and NPM scripts, you can automatically add new releases to the change log.

* First, install `changelog-cli` as a `devDependency`

```
$ npm install --save-dev git+https://fldubois@github.com/changelog-cli.git
```

* Then, add this `preversion` script to your `package.json`

```js
{
  ...
  "scripts": {
    ...
    "preversion": "chlg release $npm_package_version",
    ...
  },
  ...
}
```

Now, new releases will be added to the change log every time you use the `npm version` command.

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

## Documentation

* [CLI commands](docs/CLI.md)
* [API functions](docs/API.md)

## License

See [License](LICENSE)
