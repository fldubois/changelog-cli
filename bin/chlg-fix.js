'use strict';

var chlgFix = require('../lib/chlg-fix');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (program.args.length < 1) {
  console.error('usage: chlg fix [options] <message>');
  process.exit(1);
}

chlgFix(program.args.join(' '), {file: program.file}, function (err) {
  if (err) {
    console.error('chlg-fix: ' + err.message);
    process.exit(1);
  }
});
