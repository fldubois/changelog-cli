'use strict';

var fs = require('fs');

module.exports = function chlgInit(file, callback) {
  if (typeof file === 'function') {
    callback = file;
    file     = null;
  }

  file = file || 'CHANGELOG.md';

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
      '## [Unreleased][unreleased]',
      ''
    ].join('\n'), {encoding: 'utf8'}, function (error) {
      return callback(error ? new Error('Cannot create file ‘' + file + '’: ' + error.message) : null);
    });
  });
};
