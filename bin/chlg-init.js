'use strict';

var program = require('commander');

var chlgInit = require('../lib/chlg-init');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

chlgInit(program.file, function (err) {
  if (err) {
    console.error('chlg-init: ' + err.message);
    process.exit(1);
  }
});
