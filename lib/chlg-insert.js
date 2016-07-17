'use strict';

/**
 * @module chlg-insert
 */

var fs   = require('fs');
var os   = require('os');
var path = require('path');

var chlgShow  = require('./chlg-show');
var sections  = require('./common/sections.js');
var releases  = require('./common/releases.js');
var formatter = require('./format/raw');

var StreamInsert = require('./common/stream-insert');

/**
 * @typedef  {object} Options
 * @property {string} [file=CHANGELOG.md] - The change log file name/path
 */

/**
 * Insert a new message in the specified section of the current release in the change log.
 *
 * @see {@link module:common/sections} for section names.
 *
 * @param  {string}   section   - The section name
 * @param  {string}   message   - The message to insert
 * @param  {Options}  [options] - Options
 * @param  {Function} callback  - Callback invoked with an optional error when the message has been inserted
 */
module.exports = function chlgInsert(section, message, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var file = options.file || 'CHANGELOG.md';

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
