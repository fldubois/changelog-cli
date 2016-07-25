'use strict';

var chlgDeprecate = require('../lib/chlg-deprecate');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (program.args.length < 1) {
  console.error('usage: chlg deprecate [options] <message>');
  process.exit(1);
}

chlgDeprecate(program.args.join(' '), {file: program.file}, function (err) {
  if (err) {
    console.error('chlg-deprecate: ' + err.message);
    process.exit(1);
  }
});
