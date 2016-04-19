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

function chlgShow(file, release, sections) {
  file    = file    || program.file;
  release = release || program.release;

  sections = (sections || program.section).map(function (section) {
    return section.toLowerCase();
  });

  if (release !== 'Unreleased' && semver.valid(release) === null) {
    console.error('chlg-show: ' + release + ' is not valid semver version');
    process.exit(1);
  }

  var error = sections.reduce(function (error, section) {
    if (!error && section !== 'all' && !sectionsUtils.valid(section)) {
      error = 'chlg-show: ' + section + ' is not valid changelog section';
    }

    return error;
  }, null);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  var regexp  = new RegExp('^## \\[' + release);

  var capture = {
    release: false,
    section: false,
    all: (sections.length === 0 || sections.indexOf('all') !== -1)
  };

  var stream = fs.createReadStream(file, {encoding: 'utf8'}).pipe(new LineStream());

  stream.on('readable', function () {
    var line;

    while (line = stream.read()) {
      if (regexp.test(line)) {
        capture.release = true;
        console.log(line);
      } else if (/^## \[/.test(line)) {
        capture.release = false;
      } else if (!capture.all && capture.release && /^### \w+$/.test(line)) {
        var captureSection = sections.some(function (section) {
          return line.toLowerCase().indexOf(section) !== -1;
        });

        if (captureSection) {
          console.log(line);
          capture.section = true;
        } else {
          capture.section = false;
        }
      } else if (capture.release && (capture.all || capture.section)) {
        console.log(line);
      }
    }
  });
}

if (require.main === module) {
  chlgShow();
} else {
  module.exports = chlgShow;
}
