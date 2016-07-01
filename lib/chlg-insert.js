'use strict';

var fs   = require('fs');
var os   = require('os');
var path = require('path');

var chlgShow  = require('./chlg-show');
var sections  = require('./common/sections.js');
var releases  = require('./common/releases.js');
var formatter = require('./format/raw');

var StreamInsert = require('./common/stream-insert');

module.exports = function chlgInsert(section, message, file, callback) {
  if (typeof file === 'function') {
    callback = file;
    file     = null;
  }

  file = file || 'CHANGELOG.md';

  if (!sections.valid(section)) {
    return callback(new Error('‘' + section + '’ is not a valid change log section'));
  }

  section = sections.clean(section);

  chlgShow({file: file}, function (error, logs) {
    if (error) {
      return callback(error);
    }

    var tmp = path.join(os.tmpdir(), 'chlg-' + Date.now() + '.md');

    var stream = fs.createReadStream(file, {encoding: 'utf8'}).on('error', callback);

    if (!logs[releases.UNRELEASED].sections.hasOwnProperty(section)) {
      stream = stream.pipe(new StreamInsert(formatter.section(section) + '\n', [
        /^## \[Unreleased/,
        new RegExp('^(### (' + sections.after(section).join('|') + ')$|## \\[\\d+|\x03)')
      ], true))
      .on('error', callback);
    }

    stream = stream.pipe(new StreamInsert(formatter.message(message), [
      /^## \[Unreleased/,
      new RegExp('^### ' + section),
      /^$/
    ], true))
    .on('error', callback)
    .pipe(fs.createWriteStream(tmp))
    .on('error', callback);

    stream.on('finish', function () {
      fs.createReadStream(tmp, {encoding: 'utf8'}).pipe(fs.createWriteStream(file)).on('finish', function () {
        fs.unlink(tmp, callback);
      }).on('error', callback);
    });
  });
};
