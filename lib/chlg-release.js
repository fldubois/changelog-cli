'use strict';

var fs     = require('fs');
var os     = require('os');
var path   = require('path');
var semver = require('semver');

var StreamInsert = require('./common/stream-insert.js');

var chlgShow  = require('./chlg-show');
var dates     = require('./common/dates');
var formatter = require('./format/raw');

var search = /## \[Unreleased\]\[unreleased\]/;

module.exports = function chlgRelease(release, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (semver.valid(release) === null) {
    return callback(new Error('‘' + release + '’ is not valid semver version'));
  }

  var file = options.file || 'CHANGELOG.md';
  var tmp  = path.join(os.tmpdir(), 'chlg-' + Date.now() + '.md');

  try {
    var date = options.date ? dates.parse(options.date) : new Date();
  } catch (error) {
    return callback(error);
  }

  if (isNaN(date.getTime())) {
    return callback(new Error('Invalid date: ' + options.date));
  }

  chlgShow({file: file, releases: ['all']}, function (error, logs) {
    if (error) {
      return callback(error);
    }

    var releases = Object.keys(logs);

    if (releases.length > 1) {
      var latest = releases[1];

      if (!semver.gt(release, latest)) {
        return callback(new Error('Last release (' + latest + ') is greater than ' + release));
      } else if (logs[latest].date.getTime() >= date.getTime()) {
        return callback(new Error('The release date is prior to the last (' + dates.format(logs[latest].date) + ')'));
      }
    }

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
  });
}
