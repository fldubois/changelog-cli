'use strict';

var fs     = require('fs');
var semver = require('semver');

var LineStream = require('lstream');

var sectionsUtils = require('./common/sections');

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

    if (section !== 'all' && !sectionsUtils.valid(section)) {
      return callback(new Error('chlg-show: ' + section + ' is not valid changelog section'));
    }
  }

  var regexp  = new RegExp('^## \\[' + release);

  var capture = {
    release: false,
    section: false,
    all: (sections.length === 0 || sections.indexOf('all') !== -1)
  };

  var stream = fs.createReadStream(file, {encoding: 'utf8'}).pipe(new LineStream());

  var logs = {};

  stream.on('readable', function () {
    var line;

    while (line = stream.read()) {
      if (regexp.test(line)) {
        capture.release = true;
        logs[release] = {};
      } else if (/^## \[/.test(line)) {
        capture.release = false;
      } else if (capture.release && /^### \w+$/.test(line)) {
        var section = /^### (\w+)$/.exec(line)[1];

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
