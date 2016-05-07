'use strict';

var chlgInsert = require('./chlg-insert');

var program = require('commander');

program
  .usage('[options] <message>')
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .parse(process.argv);

if (require.main === module) {
  if (program.args.length < 1) {
    console.error('usage: chlg security [options] <message>');
    process.exit(1);
  }

  chlgInsert('Security', program.args.join(' '), program.file, function (err) {
    if (err) {
      console.error('chlg-security: ' + err.message);
      process.exit(1);
    }
  });
} else {
  module.exports = chlgInsert.bind(null, 'Security');
}
