'use strict';

var chlgInsert = require('./chlg-insert');
var sections   = require('./common/sections.js');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (require.main === module) {
  if (program.args.length < 1) {
    console.error('usage: chlg remove [options] <message>');
    process.exit(1);
  }

  chlgInsert(sections.REMOVED, program.args.join(' '), program.file, function (err) {
    if (err) {
      console.error('chlg-remove: ' + err.message);
      process.exit(1);
    }
  });
} else {
  module.exports = chlgInsert.bind(null, sections.REMOVED);
}
