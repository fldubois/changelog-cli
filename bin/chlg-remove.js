'use strict';

var chlgRemove = require('../lib/chlg-remove');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (program.args.length < 1) {
  console.error('usage: chlg remove [options] <message>');
  process.exit(1);
}

chlgRemove(program.args.join(' '), program.file, function (err) {
  if (err) {
    console.error('chlg-remove: ' + err.message);
    process.exit(1);
  }
});
