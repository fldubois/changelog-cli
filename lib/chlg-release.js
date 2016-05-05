'use strict';

var fs     = require('fs');
var os     = require('os');
var path   = require('path');
var semver = require('semver');

var StreamInsert = require('./common/stream-insert.js');

var formatter = require('./format/raw');

var program = require('commander');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

var search = /## \[Unreleased\]\[unreleased\]/;

function chlgRelease(release, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (semver.valid(release) === null) {
    return callback(new Error(release + ' is not valid semver version'));
  }

  var file = options.file || program.file;
  var tmp  = path.join(os.tmpdir(), 'chlg-' + Date.now() + '.md');
  var date = new Date().toISOString().split('T')[0];

  var insert = '\n' + formatter.release(release, date);

  var stream = fs.createReadStream(file, {encoding: 'utf8'})
    .on('error', callback)
    .pipe(new StreamInsert(insert, search))
    .on('error', callback)
    .pipe(fs.createWriteStream(tmp))
    .on('error', callback);

  stream.on('finish', function () {
    fs.createReadStream(tmp, {encoding: 'utf8'}).pipe(fs.createWriteStream(file)).on('finish', function () {
      fs.unlink(tmp, callback);
    }).on('error', callback);
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
  module.exports = chlgRelease;
}
