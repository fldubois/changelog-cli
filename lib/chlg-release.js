'use strict';

/**
 * @module chlg-release
 */

var fs     = require('fs');
var os     = require('os');
var path   = require('path');
var semver = require('semver');

var StreamInsert = require('./common/stream-insert.js');

var chlgShow  = require('./chlg-show');
var dates     = require('./common/dates');
var defaults  = require('./common/defaults');
var formatter = require('./format/raw');

var search = /## \[Unreleased\]/;

/**
 * @typedef  {object} Options
 * @property {string} [file=CHANGELOG.md] - The change log file name/path.
 * @property {string} [date=now]          - Force a specific release date, default to the current date.
 */

/**
 * Add a new release to the change log containing all current messages.
 *
 * @param  {string}   release   - Release number (semver version) or increment (major, minor or patch)
 * @param  {Options}  [options] - Options
 * @param  {Function} callback  - Callback invoked with an optional error when the release has been added in change log
 */
module.exports = function chlgRelease(release, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var increment = (['major', 'minor', 'patch'].indexOf(release) !== -1);

  if (!increment && semver.valid(release) === null) {
    return callback(new Error('‘' + release + '’ is not valid semver version'));
  }

  var file = options.file || defaults.file;
  var tmp  = path.join(os.tmpdir(), 'chlg-' + Date.now() + '.md');

  try {
    var date = options.date ? dates.parse(options.date) : new Date();

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

        if (increment) {
          release = semver.inc(latest, release);
        }

        if (!semver.gt(release, latest)) {
          return callback(new Error('Last release (' + latest + ') is greater than ' + release));
        } else if (logs[latest].date.getTime() >= date.getTime()) {
          return callback(new Error('The release date is prior to the last (' + dates.format(logs[latest].date) + ')'));
        }
      } else if (increment) {
        release = semver.inc('0.0.0', release);
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
  } catch (error) {
    return callback(error);
  }
};
