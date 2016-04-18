'use strict';

var fs     = require('fs');
var semver = require('semver');

var LineStream = require('lstream');

var sectionsUtils = require('./common/sections');

var program = require('commander');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .option('-r, --release [release]', 'Release version to show', 'Unreleased')
  .option('-s, --section [section]', 'Changes section to show', 'all')
  .parse(process.argv);

function chlgShow(file, release, section) {
  file    = file    || program.file;
  release = release || program.release;
  section = section || program.section;

  if (release !== 'Unreleased' && semver.valid(release) === null) {
    console.error('chlg-show: ' + release + ' is not valid semver version');
    process.exit(1);
  }

  var sections = [];
  var captureAll = false;

  section.split(',').forEach(function (section) {
    if (/all/i.test(section)) {
      captureAll = true;
    } else {
      if (!sectionsUtils.valid(section)) {
        console.error('chlg-show: ' + section + ' is not valid changelog section');
        process.exit(1);
      }

      sections.push(section.toLowerCase());
    }
  });

  var regexp  = new RegExp('^## \\[' + release);

  var capture = {
    release: false,
    section: false
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
      } else if (!captureAll && capture.release && /^### \w+$/.test(line)) {
        var captureSection = sections.some(function (section) {
          return line.toLowerCase().indexOf(section) !== -1;
        });

        if (captureSection) {
          console.log(line);
          capture.section = true;
        } else {
          capture.section = false;
        }
      } else if (capture.release && (captureAll || capture.section)) {
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
