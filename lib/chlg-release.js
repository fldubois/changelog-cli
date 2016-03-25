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

function chlgRelease(release, file) {
  file = file || program.file;

  var version = semver.valid(release);

  if (version === null) {
    console.error('chlg-release: ' + release + ' is not valid semver version');
    process.exit(1);
  }

  fs.stat(file, function (err) {
    if (err) {
      console.error('chlg-release: file ‘' + file + '’ does not exist');
      process.exit(1);
    }

    var date = new Date().toISOString().split('T')[0];
    var replace = '## [Unreleased][unreleased]\n\n## [' + release + '][' + date + ']';

    shell.sed('-i', search, replace, file);

    var error = shell.error();

    if (error) {
      console.error('chlg-release: ' + error);
      process.exit(1);
    }
  });
}

if (require.main === module) {
  if (program.args.length < 1) {
    console.error('usage: chlg release <release>');
    process.exit(1);
  }

  chlgRelease(program.args[0]);
} else {
  module.exports = chlgShow;
}
