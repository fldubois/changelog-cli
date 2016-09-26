'use strict';

/**
 * @module chlg-show
 */

var fs     = require('fs');

var async  = require('async');
var semver = require('semver');

var LineStream = require('lstream');

var common = {
  dates:    require('./common/dates'),
  defaults: require('./common/defaults'),
  releases: require('./common/releases'),
  sections: require('./common/sections')
};

var validators = {
  file: function (file, callback) {
    return callback(null, file);
  },
  releases: function (releases, callback) {
    if (releases.length === 0) {
      return callback(new Error('No release selected'));
    }

    for (var i = 0; i < releases.length; i++) {
      var ignore = ['all', 'latest', common.releases.UNRELEASED];

      if (ignore.indexOf(releases[i]) === -1 && semver.validRange(releases[i]) === null) {
        return callback(new Error('‘' + releases[i] + '’ is not valid semver version/range'));
      }
    }

    if (releases.indexOf('all') !== -1) {
      releases = ['all'];
    } else if (releases.indexOf('latest') !== -1) {
      releases = ['latest'];
    }

    return callback(null, releases);
  },
  sections: function (sections, callback) {
    sections = sections.map(function (section) {
      return section.toLowerCase();
    });

    for (var i = 0; i < sections.length; i++) {
      if (sections[i] !== 'all' && !common.sections.valid(sections[i])) {
        return callback(new Error('‘' + sections[i] + '’ is not valid changelog section'));
      }
    }

    if (sections.indexOf('all') !== -1) {
      sections = ['all'];
    }

    return callback(null, sections);
  },
  date: function (input, callback) {
    var date = (typeof input === 'string') ? common.dates.parse(input) : null;

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
 * @typedef  {object}          Options
 * @property {string}          [file=CHANGELOG.md]   - The change log file name/path.
 * @property {string|string[]} [releases=Unreleased] - Releases filter (semver version/range, 'Unreleased', 'all' or
 *                                                   'latest')
 * @property {string|string[]} [sections=all]        - Sections filter (section name or 'all')
 * @property {string}          [from]                - Filter all releases prior to this date
 * @property {string}          [to]                  - Filter all releases after that date
 */

/**
 * Get the messages from the change log, optionaly filtered by dates, versions and/or sections.
 *
 * @param  {Options}  [options] - Options
 * @param  {Function} callback  - Callback invoked with an optional error and an object containing the messages
 */
module.exports = function chlgShow(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  async.parallel({
    file:     async.apply(validators.file,     options.file     || common.defaults.file),
    releases: async.apply(validators.releases, options.releases || common.defaults.releases),
    sections: async.apply(validators.sections, options.sections || common.defaults.sections),
    from:     async.apply(validators.date,     options.from),
    to:       async.apply(validators.date,     options.to)
  }, function (error, results) {
    if (error) {
      return callback(error);
    }

    var capture = {
      release: (results.releases[0] === 'all' || results.releases[0] === 'latest') ? 'all' : false,
      section: (results.sections[0] === 'all') ? 'all' : false
    };

    var current = {
      release: null,
      version: null
    };

    var stream = fs.createReadStream(results.file, {encoding: 'utf8'})
      .on('error', callback)
      .pipe(new LineStream())
      .on('error', callback);

    var logs = {};

    stream.on('readable', function () {
      var line = stream.read();

      while (line) {
        if (common.releases.test(line)) {
          current.release = null;

          var extract = common.releases.extract(line);

          if (capture.release !== 'all') {
            capture.release = results.releases.some(function (release) {
              if (extract.version === common.releases.UNRELEASED) {
                return release === common.releases.UNRELEASED;
              }

              return semver.satisfies(extract.version, release);
            });
          }

          if (capture.release && common.dates.isBetween(extract.date, results.from, results.to)) {
            current.release = extract.version;

            logs[current.release] = {
              date:     extract.date,
              sections: {}
            };
          }
        } else if (current.release && common.sections.test(line)) {
          current.section = common.sections.extract(line);

          if (capture.section !== 'all') {
            capture.section = (results.sections.indexOf(current.section.toLowerCase()) !== -1);
          }

          if (capture.section && !Array.isArray(logs[current.release].sections[current.section])) {
            logs[current.release].sections[current.section] = [];
          }
        } else if (current.release && current.release && current.section && capture.section) {
          logs[current.release].sections[current.section].push(line.substring(2));
        }

        line = stream.read();
      }
    }).on('end', function () {
      if (results.releases[0] === 'latest') {
        var versions = Object.keys(logs);

        if (versions.length > 1) {
          var latest = versions[1];

          versions.forEach(function (version) {
            if (version !== latest) {
              delete logs[version];
            }
          });
        } else {
          logs = {};
        }
      }

      if (Object.keys(logs).length === 0) {
        return callback(new Error('No matching release found'));
      }

      callback(null, logs);
    });
  });
};
