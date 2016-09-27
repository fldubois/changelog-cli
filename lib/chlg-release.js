'use strict';

/**
 * @module chlg-release
 */

var fs     = require('fs');
var os     = require('os');
var path   = require('path');

var async  = require('async');
var semver = require('semver');

var StreamInsert = require('stream-insert');

var chlgShow  = require('./chlg-show');
var dates     = require('./common/dates');
var defaults  = require('./common/defaults');
var formatter = require('./format/raw');

var search = /## \[Unreleased\]/;

var validators = {
  file: function (file, callback) {
    return callback(null, file);
  },
  date: function (input, callback) {
    var date = (typeof input === 'string') ? dates.parse(input) : new Date();

    if (typeof input === 'string' && date === null) {
      return callback(new Error('Date format must be YYYY-MM-DD'));
    }

    if (date !== null && isNaN(date.getTime())) {
      return callback(new Error('Invalid date: ' + input));
    }

    return callback(null, date);
  }
};

/**
 * Gets the next release for the specified change log.
 * If a release number is passed, checks if the number is superior to the last release in the file.
 * If an increment is passed, returns the release number incremented from the last release in the file.
 * It also checks if the release date is superior to the last release date in the file.
 *
 * @param  {string}   release  - Release number or increment (major, minor or patch)
 * @param  {Date}     date     - Release date
 * @param  {string}   file     - Change log file name/path
 * @param  {Function} callback - Callback invoked with an optional error and and the next release number
 */
function getNextRelease(release, date, file, callback) {
  var increment = (['major', 'minor', 'patch'].indexOf(release) !== -1);

  if (!increment && semver.valid(release) === null) {
    return callback(new Error('‘' + release + '’ is not valid semver version'));
  }

  chlgShow({file: file, releases: ['all']}, function (error, logs) {
    if (error) {
      return callback(error);
    }

    var releases = Object.keys(logs);

    if (releases.length > 1) {
      var latest = releases[1];

      if (logs[latest].date.getTime() >= date.getTime()) {
        return callback(new Error('The release date is prior to the last (' + dates.format(logs[latest].date) + ')'));
      }

      if (increment) {
        return callback(null, semver.inc(latest, release));
      }

      if (!semver.gt(release, latest)) {
        return callback(new Error('Last release (' + latest + ') is greater than ' + release));
      }
    } else if (increment) {
      return callback(null, semver.inc('0.0.0', release));
    }

    return callback(null, release);
  });
}

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

  async.parallel({
    file: async.apply(validators.file, options.file || defaults.file),
    date: async.apply(validators.date, options.date)
  }, function (error, results) {
    if (error) {
      return callback(error);
    }

    getNextRelease(release, results.date, results.file, function (error, nextRelease) {
      if (error) {
        return callback(error);
      }

      var tmp    = path.join(os.tmpdir(), 'chlg-' + Date.now() + '.md');
      var insert = '\n' + formatter.release(nextRelease, results.date);

      var stream = fs.createReadStream(results.file, {encoding: 'utf8'})
        .on('error', callback)
        .pipe(new StreamInsert(insert, search))
        .on('error', callback)
        .pipe(fs.createWriteStream(tmp))
        .on('error', callback);

      stream.on('finish', function () {
        fs.createReadStream(tmp, {encoding: 'utf8'}).pipe(fs.createWriteStream(results.file)).on('finish', function () {
          fs.unlink(tmp, callback);
        }).on('error', callback);
      });
    });
  });
};
