# chlg-cli

[![npm](https://img.shields.io/npm/v/chlg-cli.svg?maxAge=3600)](https://www.npmjs.com/package/chlg-cli)
[![Build Status](https://travis-ci.org/fldubois/chlg-cli.svg?branch=master)](https://travis-ci.org/fldubois/chlg-cli)
[![Coverage Status](https://coveralls.io/repos/github/fldubois/chlg-cli/badge.svg?branch=master)](https://coveralls.io/github/fldubois/chlg-cli?branch=master)
[![dependencies Status](https://david-dm.org/fldubois/chlg-cli/status.svg)](https://david-dm.org/fldubois/chlg-cli)
[![devDependencies Status](https://david-dm.org/fldubois/chlg-cli/dev-status.svg)](https://david-dm.org/fldubois/chlg-cli?type=dev)

> Simple command line interface to edit CHANGELOG files according to [keepachangelog.com](http://keepachangelog.com/) rules.

## Command line usage

* Install `chlg-cli` (global installation is recommended for command line usage)

```
$ npm install --global chlg-cli
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

* First, install `chlg-cli` as a `devDependency`

```
$ npm install --save-dev chlg-cli
```

* Then, add this `version` script to your `package.json`

```js
{
  ...
  "scripts": {
    ...
    "version": "chlg release $npm_package_version && git add CHANGELOG.md",
    ...
  },
  ...
}
```

Now, new releases will be added to the change log every time you use the `npm version` command.

## Programmatic usage

* Install `chlg-cli` in your project

```
$ npm install --save-dev chlg-cli
```

* Start using the API

```js
'use strict';

var chlg = require('chlg-cli');

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
