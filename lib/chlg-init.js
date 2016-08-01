'use strict';

/**
 * @module chlg-init
 */

var fs = require('fs');

var defaults = require('./common/defaults');
var releases = require('./common/releases');
var format   = require('./format/raw');

/**
 * Initiliaze a new change log with a standard boilerplate.
 *
 * @see    {@link http://keepachangelog.com/}
 *
 * @param  {string}   [file=CHANGELOG.md] - File name/path of the new change log
 * @param  {Function} callback            - Callback invoked with an optional error when the change log is initialized
 */
module.exports = function chlgInit(file, callback) {
  if (typeof file === 'function') {
    callback = file;
    file     = null;
  }

  file = file || defaults.file;

  if (typeof file !== 'string') {
    return callback(new Error('Parameter ‘file’ must be a string'));
  }

  fs.stat(file, function (err) {
    if (!err || err.code !== 'ENOENT') {
      return callback(new Error('Cannot create file ‘' + file + '’: File exists'));
    }

    fs.writeFile(file, [
      '# Change Log',
      'All notable changes to this project will be documented in this file.',
      'This project adheres to [Semantic Versioning](http://semver.org/).',
      '',
      format.release(releases.UNRELEASED),
      ''
    ].join('\n'), {encoding: 'utf8'}, function (error) {
      return callback(error ? new Error('Cannot create file ‘' + file + '’: ' + error.message) : null);
    });
  });
};
