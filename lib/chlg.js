'use strict';

if (require.main === module) {  // Direct call
  process.argv[1] = __filename;

  var program = require('commander');

  program.version(require('../package.json').version)
    .command('init',      'Initialize a new changelog file')
    .command('release',   'Set all current changes under a new version')
    .command('show',      'Show changes')
    .command('edit',      'Edit changes interactively')
    .command('add',       'Add a new feature in current changes')
    .command('change',    'Point out a change in an existing functionality')
    .command('deprecate', 'Tag a feature as deprecated for the upcoming release')
    .command('remove',    'Point out a feature deleted in the upcoming release')
    .command('fix',       'Add a bug fix to changes list')
    .parse(process.argv);
} else {  // Required by another file
  module.exports = {
    init: require('./chlg-init'),
    show: require('./chlg-show')
  }
}
