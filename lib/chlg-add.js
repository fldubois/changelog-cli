'use strict';

var fs   = require('fs');
var os   = require('os');
var path = require('path');
var util = require('util');

var Transform  = require('stream').Transform;
var LineStream = require('lstream');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);


var sections = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security'
];


function StreamInsert(section, message, options) {
  if (!(this instanceof StreamInsert)) {
    return new StreamInsert(options);
  }

  Transform.call(this, options);

  this.message = '- ' + message.replace(/\n*$/, '\n');

  this.searches = {
    release: /^## \[Unreleased/,
    section: new RegExp('^### ' + section),
    end: new RegExp('^(### (' + sections.slice(sections.indexOf(section) + 1).join('|') + '))?$')
  };

  this.found = {
    release: false,
    section: false,
    end: false
  };
}

util.inherits(StreamInsert, Transform);

StreamInsert.prototype._transform = function(chunk, encoding, done) {
  var line = chunk.toString();

  if (!this.found.release && this.searches.release.test(line)) {
    this.found.release = true;
  }

  if (this.found.release && !this.found.section && this.searches.section.test(line)) {
    this.found.section = true;
  }

  if (this.found.release && !this.found.end && this.searches.end.test(line)) {
    this.found.end = true;

    if (!this.found.section) {
      line = '### Added\n' + line;
    }

    line = this.message + line;
  }

  this.push(line + '\n');

  done();
};


function chlgAdd(message, file) {
  file = file || program.file;

  var regexp  = new RegExp('^## \\[Unreleased');
  var tmp = path.join(os.tmpdir(), 'chg-' + Date.now() + '.md');

  var stream = fs.createReadStream(file, {encoding: 'utf8'})
    .pipe(new LineStream())
    .pipe(new StreamInsert('Added', message))
    .pipe(fs.createWriteStream(tmp));

  stream.on('finish', function () {
    fs.createReadStream(tmp, {encoding: 'utf8'}).pipe(fs.createWriteStream(file)).on('finish', function () {
      fs.unlink(tmp, function (err) {
        if (err) {
          console.error('chlg-add: ' + err.message);
          process.exit(1);
        }
      });
    });
  });
}

if (require.main === module) {
  if (program.args.length < 1) {
    console.error('usage: chlg add <message>');
    process.exit(1);
  }

  chlgAdd(program.args.join(' '));
} else {
  module.exports = chlgShow;
}
