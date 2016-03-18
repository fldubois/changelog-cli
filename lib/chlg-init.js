'use strict';

var fs = require('fs');

var program = require('commander');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

function chlgInit(file) {
  file = file || program.file;

  fs.stat(program.file, function (err) {
    if (!err || err.code !== 'ENOENT') {
      console.error('chlg-init: cannot create file ‘' + program.file + '’: File exists');
      process.exit(1);
    }

    fs.writeFile(program.file, [
      '# Change Log',
      'All notable changes to this project will be documented in this file.',
      'This project adheres to [Semantic Versioning](http://semver.org/).',
      '',
      '## [Unreleased][unreleased]',
      ''
    ].join('\n'), {encoding: 'utf8'}, function (err) {
      if (err) {
        console.error('chlg-init: cannot create file ‘' + program.file + '’: ' + err.message);
        process.exit(1);
      }
    });
  })
}

if (require.main === module) {
  chlgInit();
} else {
  module.exports = chlgInit;
}
