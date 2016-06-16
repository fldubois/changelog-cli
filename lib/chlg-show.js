'use strict';

var fs     = require('fs');
var chalk  = require('chalk');
var semver = require('semver');

var LineStream = require('lstream');

var common = {
  releases: require('./common/releases'),
  sections: require('./common/sections')
};

var dates     = require('./common/dates');
var formatter = require('./format');

var program = require('commander');

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .option('-r, --release [release]', 'Release version to show', collect, [])
  .option('-s, --section [section]', 'Changes section to show', collect, [])
  .option('-F, --format [format]', 'Ouput format', 'raw')
  .option('--from [date]', 'Filter release before this date')
  .option('--to [date]', 'Filter release after this date')
  .option('-C, --no-color', 'Disable ouput colors')
  .parse(process.argv);

function chlgShow(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var file     = options.file     || program.file;
  var releases = options.releases || program.release;

  try {
    var from = (typeof options.from === 'string') ? dates.parse(options.from) : null;
    var to   = (typeof options.to   === 'string') ? dates.parse(options.to)   : null;
  } catch (error) {
    return callback(error);
  }

  var sections = (options.sections || program.section).map(function (section) {
    return section.toLowerCase();
  });

  if (releases.length === 0) {
    releases = [common.releases.UNRELEASED];
  } else {
    for (var i = 0; i < releases.length; i++) {
      if (releases[i] !== 'all' && releases[i] !== 'latest' && releases[i] !== common.releases.UNRELEASED) {
        if (semver.validRange(releases[i]) === null) {
          return callback(new Error('‘' + releases[i] + '’ is not valid semver version/range'));
        }
      }
    }
  }

  if (releases.indexOf('all') !== -1) {
    releases = ['all'];
  } else if (releases.indexOf('latest') !== -1) {
    releases = ['latest'];
  }

  if (sections.length === 0) {
    sections = ['all'];
  } else {
    for (var i = 0; i < sections.length; i++) {
      if (sections[i] !== 'all' && !common.sections.valid(sections[i])) {
        return callback(new Error('‘' + sections[i] + '’ is not valid changelog section'));
      }
    }
  }

  if (sections.indexOf('all') !== -1) {
    sections = ['all'];
  }

  var capture = {
    release: (releases[0] === 'all' || releases[0] === 'latest') ? 'all' : false,
    section: (sections[0] === 'all') ? 'all' : false
  };

  var current = {
    release: null,
    version: null
  };

  var stream = fs.createReadStream(file, {encoding: 'utf8'})
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
        var date    = /\d{4}-\d{2}-\d{2}/.test(extract.date) ? new Date(extract.date) : null;

        if (capture.release !== 'all') {
          capture.release = releases.some(function (release) {
            if (extract.version === common.releases.UNRELEASED) {
              return release === common.releases.UNRELEASED;
            } else {
              return semver.satisfies(extract.version, release);
            }
          });
        }

        if (capture.release && dates.isBetween(date, from, to)) {
          current.release = extract.version;

          logs[current.release] = {
            date:     date,
            sections: {}
          };
        }
      } else if (current.release && common.sections.test(line)) {
        current.section = common.sections.extract(line);

        if (capture.section !== 'all') {
          capture.section = (sections.indexOf(current.section.toLowerCase()) !== -1);
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
    if (releases[0] === 'latest') {
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
}

if (require.main === module) {
  chalk.enabled = program.color;

  chlgShow({
    file: program.file,
    from: program.from,
    to:   program.to
  }, function (error, logs) {
    if (error) {
      console.error('chlg-show: ' + error.message);
      process.exit(1);
    }

    formatter(program.format, logs, function (err, lines) {
      if (err) {
        console.error('chlg-show: ' + err.message);
        process.exit(1);
      }

      console.log(lines);
    });
  });
} else {
  module.exports = chlgShow;
}
