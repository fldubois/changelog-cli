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

  var error = sections.reduce(function (error, section) {
    if (!error && section !== 'all' && !sectionsUtils.valid(section)) {
      error = 'chlg-show: ' + section + ' is not valid changelog section';
    }

    return error;
  }, null);

  if (error) {
    return callback(new Error(error));
  }

  var regexp  = new RegExp('^## \\[' + release);

  var capture = {
    release: false,
    section: false,
    all: (sections.length === 0 || sections.indexOf('all') !== -1)
  };

  var stream = fs.createReadStream(file, {encoding: 'utf8'}).pipe(new LineStream());

  var lines = [];

  stream.on('readable', function () {
    var line;

    while (line = stream.read()) {
      if (regexp.test(line)) {
        capture.release = true;
        lines.push(line);
      } else if (/^## \[/.test(line)) {
        capture.release = false;
      } else if (!capture.all && capture.release && /^### \w+$/.test(line)) {
        var captureSection = sections.some(function (section) {
          return line.toLowerCase().indexOf(section) !== -1;
        });

        if (captureSection) {
          lines.push(line);
          capture.section = true;
        } else {
          capture.section = false;
        }
      } else if (capture.release && (capture.all || capture.section)) {
        lines.push(line);
      }
    }
  }).on('end', function () {
    callback(null, lines);
  }).on('error', callback);
}

if (require.main === module) {

  chlgShow(function (error, lines) {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    lines.forEach(function (line) {
      console.log(line);
    });
  });

} else {
  module.exports = chlgShow;
}
