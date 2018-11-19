'use strict';

/**
 * @module chlg-init
 */

var fs = require('fs');

var PassThrough = require('stream').PassThrough;

var defaults = require('./common/defaults');
var releases = require('./common/releases');
var format   = require('./format/raw');

var template = [
  '# Changelog',
  'All notable changes to this project will be documented in this file.',
  '',
  'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),',
  'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).',
  '',
  format.release(releases.UNRELEASED)
];

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

  var input  = new PassThrough();
  var output = fs.createWriteStream(file, {flags: 'wx', defaultEncoding: 'utf8'});

  output.on('finish', function () {
    return callback(null);
  }).on('error', function (error) {
    var message = (error.hasOwnProperty('code') && error.code === 'EEXIST') ? 'File exists' : error.message;

    return callback(new Error('Cannot create file ‘' + file + '’: ' + message));
  });

  input.pipe(output);

  template.forEach(function (line) {
    input.write(line + '\n');
  });

  input.end();
};
