'use strict';

var chlgInsert = require('./chlg-insert');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (require.main === module) {
  if (program.args.length < 1) {
    console.error('usage: chlg add [options] <message>');
    process.exit(1);
  }

  chlgInsert('Added', program.args.join(' '), program.file);
} else {
  module.exports = chlgInsert.bind(undefined, 'Added');
}
