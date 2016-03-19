'use strict';

var fs = require('fs');

var LineStream = require('lstream');

var program = require('commander');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .option('-r, --release [release]', 'Release version to use', 'Unreleased')
  .parse(process.argv);

function chlgShow(file, release) {
  file    = file    || program.file;
  release = release || program.release;

  var regexp  = new RegExp('^## \\[' + release);
  var capture = false;

  var stream = fs.createReadStream(program.file, {encoding: 'utf8'}).pipe(new LineStream());

  stream.on('readable', function () {
    var line;

    while (line = stream.read()) {
      if (regexp.test(line)) {
        capture = true;
      } else if (/^## \[/.test(line)) {
        capture = false;
      } else if (capture) {
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
