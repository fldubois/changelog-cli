'use strict';

var fs     = require('fs');
var chalk  = require('chalk');
var semver = require('semver');

var LineStream = require('lstream');

var common = {
  releases: require('./common/releases'),
  sections: require('./common/sections')
};

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
  .option('-C, --no-color', 'Disable ouput colors')
  .parse(process.argv);

function chlgShow(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var file     = options.file     || program.file;
  var releases = options.releases || program.release;

  var sections = (options.sections || program.section).map(function (section) {
    return section.toLowerCase();
  });

  if (releases.length === 0) {
    releases = [common.releases.UNRELEASED];
  } else {
    for (var i = 0; i < releases.length; i++) {
      if (releases[i] !== 'all' && releases[i] !== common.releases.UNRELEASED && semver.valid(releases[i]) === null) {
        return callback(new Error('‘' + releases[i] + '’ is not valid semver version'));
      }
    }
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

  var capture = {
    release: (releases.length === 1 && releases[0] === 'all') ? 'all' : false,
    section: (sections.length === 1 && sections[0] === 'all') ? 'all' : false
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
        var extract = common.releases.extract(line);

        if (capture.release !== 'all') {
          capture.release = (releases.indexOf(extract.version) !== -1);
        }

        if (capture.release) {
          current.release = extract.version;

          logs[current.release] = {
            date:     extract.date,
            sections: {}
          };
        }
      } else if (capture.release && common.sections.test(line)) {
        current.section = common.sections.extract(line);

        if (capture.section !== 'all') {
          capture.section = (sections.indexOf(current.section.toLowerCase()) !== -1);
        }

        if (capture.section && !Array.isArray(logs[current.release].sections[current.section])) {
          logs[current.release].sections[current.section] = [];
        }
      } else if (current.release && capture.release && current.section && capture.section) {
        logs[current.release].sections[current.section].push(line.substring(2));
      }

      line = stream.read();
    }
  }).on('end', function () {
    callback(null, logs);
  });
}

if (require.main === module) {
  chalk.enabled = program.color;

  chlgShow(function (error, logs) {
    if (error) {
      console.error('chlg-show: ' + error.message);
      process.exit(1);
    }

    formatter(program.format, logs, function (err) {
      if (err) {
        console.error('chlg-show: ' + err.message);
        process.exit(1);
      }
    });
  });
} else {
  module.exports = chlgShow;
}
