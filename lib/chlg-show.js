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
  .option('-r, --release [release]', 'Release version to show', common.releases.UNRELEASED)
  .option('-s, --section [section]', 'Changes section to show', collect, [])
  .option('-F, --format [format]', 'Ouput format', 'raw')
  .option('-C, --no-color', 'Disable ouput colors')
  .parse(process.argv);

function chlgShow(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var file    = options.file    || program.file;
  var release = options.release || program.release;

  var sections = (options.sections || program.section).map(function (section) {
    return section.toLowerCase();
  });

  if (release !== common.releases.UNRELEASED && semver.valid(release) === null) {
    return callback(new Error('‘' + release + '’ is not valid semver version'));
  }

  for (var i = 0; i < sections.length; i++) {
    if (sections[i] !== 'all' && !common.sections.valid(sections[i])) {
      return callback(new Error('‘' + sections[i] + '’ is not valid changelog section'));
    }
  }

  var capture = {
    release: false,
    section: false,
    all:     (sections.length === 0 || sections.indexOf('all') !== -1)
  };

  var stream = fs.createReadStream(file, {encoding: 'utf8'}).pipe(new LineStream());

  var logs = {};

  stream.on('readable', function () {
    var line = stream.read();

    while (line) {
      if (common.releases.test(line)) {
        var extract = common.releases.extract(line);

        if (extract.version.toLowerCase() === release.toLowerCase()) {
          capture.release = true;

          logs[release] = {
            date:     extract.date,
            sections: {}
          };
        } else {
          capture.release = false;
        }
      } else if (capture.release && common.sections.test(line)) {
        var section = common.sections.extract(line);

        if (capture.all || sections.indexOf(section.toLowerCase()) !== -1) {
          logs[release].sections[section] = [];
          capture.section = section;
        } else {
          capture.section = false;
        }
      } else if (capture.release && capture.section) {
        logs[release].sections[capture.section].push(line.substring(2));
      }

      line = stream.read();
    }
  }).on('end', function () {
    callback(null, logs);
  }).on('error', callback);
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
