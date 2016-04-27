'use strict';

var fs     = require('fs');
var semver = require('semver');
var shell  = require('shelljs');

var program = require('commander');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

var search = /## \[Unreleased\]\[unreleased\]/;

shell.config.silent = true;

function chlgRelease(release, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (semver.valid(release) === null) {
    return callback(new Error(release + ' is not valid semver version'));
  }

  var file = options.file || program.file;

  fs.stat(file, function (err) {
    if (err) {
      return callback(err.code === 'ENOENT' ? new Error('file ‘' + file + '’ does not exist') : err);
    }

    var date = new Date().toISOString().split('T')[0];
    var replace = '## [Unreleased][unreleased]\n\n## [' + release + '][' + date + ']';

    shell.sed('-i', search, replace, file);

    var error = shell.error();

    return callback(error ? new Error(error) : null);
  });
}

if (require.main === module) {
  if (program.args.length < 1) {
    console.error('usage: chlg release <release>');
    process.exit(1);
  }

  chlgRelease(program.args[0], function (error) {
    if (error) {
      console.error('chlg-release: ' + error.message);
      process.exit(1);
    }
  });
} else {
  module.exports = chlgShow;
}
