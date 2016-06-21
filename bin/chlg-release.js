'use strict';

var program = require('commander');

var chlgRelease = require('../lib/chlg-release');

program
  .option('-f, --file [filename]', 'Changelog filename', 'CHANGELOG.md')
  .option('-d, --date [date]', 'Set the release date')
  .parse(process.argv);


if (program.args.length < 1) {
  console.error('usage: chlg release [options] <release>');
  process.exit(1);
}

chlgRelease(program.args[0], {date: program.date}, function (error) {
  if (error) {
    console.error('chlg-release: ' + error.message);
    process.exit(1);
  }
});
