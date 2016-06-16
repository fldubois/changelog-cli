'use strict';

var fs = require('fs');

var program = require('commander');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

function chlgInit(file, callback) {
  file = file || program.file;

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
}

if (require.main === module) {
  chlgInit(program.file, function (err) {
    if (err) {
      console.error('chlg-init: ' + err.message);
      process.exit(1);
    }
  });
} else {
  module.exports = chlgInit;
}
