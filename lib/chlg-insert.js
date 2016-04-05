'use strict';

var fs   = require('fs');
var os   = require('os');
var path = require('path');

var LineStream = require('lstream');

var ChangelogInsert = require('./common/changelog-insert');

var program = require('commander');

program
  .usage('[options] <section> <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

function chlgInsert(section, message, file) {
  file = file || program.file;

  var regexp  = new RegExp('^## \\[Unreleased');
  var tmp = path.join(os.tmpdir(), 'chlg-' + Date.now() + '.md');

  var stream = fs.createReadStream(file, {encoding: 'utf8'})
    .pipe(new LineStream())
    .pipe(new ChangelogInsert(section, message))
    .pipe(fs.createWriteStream(tmp));

  stream.on('finish', function () {
    fs.createReadStream(tmp, {encoding: 'utf8'}).pipe(fs.createWriteStream(file)).on('finish', function () {
      fs.unlink(tmp, function (err) {
        if (err) {
          console.error('chlg-insert: ' + err.message);
          process.exit(1);
        }
      });
    });
  });
}

if (require.main === module) {
  if (program.args.length < 2) {
    console.error('usage: chlg insert [options] <section> <message>');
    process.exit(1);
  }

  chlgInsert(program.args.shift(), program.args.join(' '));
} else {
  module.exports = chlgInsert;
}
