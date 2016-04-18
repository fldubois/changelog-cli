'use strict';

var fs     = require('fs');
var semver = require('semver');

var LineStream = require('lstream');

var sections = require('./common/sections');

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

  if (!/all/i.test(section) && !sections.valid(section)) {
    console.error('chlg-show: ' + section + ' is not valid changelog section');
    process.exit(1);
  }

  section = section.toLowerCase();

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
      } else if (section !== 'all' && capture.release && /^### \w+$/.test(line)) {
        if (line.toLowerCase().indexOf(section) !== -1) {
          console.log(line);
          capture.section = true;
        } else {
          capture.section = false;
        }
      } else if (capture.release && (section === 'all' || capture.section)) {
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
