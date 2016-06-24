'use strict';

var chlgChange = require('../lib/chlg-change');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (program.args.length < 1) {
  console.error('usage: chlg change [options] <message>');
  process.exit(1);
}

chlgChange(program.args.join(' '), program.file, function (err) {
  if (err) {
    console.error('chlg-change: ' + err.message);
    process.exit(1);
  }
});
