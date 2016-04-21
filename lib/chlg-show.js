'use strict';

var fs     = require('fs');
var semver = require('semver');

var LineStream = require('lstream');

var common = {
  releases: require('./common/releases'),
  sections: require('./common/sections')
};

var program = require('commander');

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .option('-r, --release [release]', 'Release version to show', 'Unreleased')
  .option('-s, --section [section]', 'Changes section to show', collect, [])
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

  if (release !== 'Unreleased' && semver.valid(release) === null) {
    return callback(new Error('chlg-show: ' + release + ' is not valid semver version'));
  }

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];

    if (section !== 'all' && !common.sections.valid(section)) {
      return callback(new Error('chlg-show: ' + section + ' is not valid changelog section'));
    }
  }

  var capture = {
    release: false,
    section: false,
    all: (sections.length === 0 || sections.indexOf('all') !== -1)
  };

  var stream = fs.createReadStream(file, {encoding: 'utf8'}).pipe(new LineStream());

  var logs = {};
  logs[release] = {};

  stream.on('readable', function () {
    var line;

    while (line = stream.read()) {
      if (common.releases.test(line)) {
        capture.release = (common.releases.extract(line).toLowerCase() === release.toLowerCase());
      } else if (capture.release && common.sections.test(line)) {
        var section = common.sections.extract(line);

        if (capture.all || sections.indexOf(section.toLowerCase()) !== -1) {
          logs[release][section] = [];
          capture.section = section;
        } else {
          capture.section = false;
        }
      } else if (capture.release && capture.section) {
        logs[release][capture.section].push(line.substring(2));
      }
    }
  }).on('end', function () {
    callback(null, logs);
  }).on('error', callback);
}

if (require.main === module) {

  chlgShow(function (error, logs) {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    Object.keys(logs).forEach(function (release) {
      console.log('## ' + release);

      Object.keys(logs[release]).forEach(function (section) {
        console.log('### ' + section);

        logs[release][section].forEach(function (message) {
          console.log('- ' + message);
        });
      });
    });
  });

} else {
  module.exports = chlgShow;
}
