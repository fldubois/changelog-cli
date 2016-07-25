'use strict';

var chlgSecurity = require('../lib/chlg-security');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (program.args.length < 1) {
  console.error('usage: chlg security [options] <message>');
  process.exit(1);
}

chlgSecurity(program.args.join(' '), {file: program.file}, function (err) {
  if (err) {
    console.error('chlg-security: ' + err.message);
    process.exit(1);
  }
});
