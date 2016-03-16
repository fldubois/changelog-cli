'use strict';

var program = require('commander');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

console.log('Deprecate a feature in ' + program.file);
