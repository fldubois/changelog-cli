'use strict';

var chalk = require('chalk');

var sectionsColors = {
  added:      chalk.green,
  changed:    chalk.yellow,
  deprecated: chalk.gray,
  removed:    chalk.red,
  fixed:      chalk.cyan,
  security:   chalk.magenta
};

var current = null;

module.exports = {
  release: function (release, date) {
    return chalk.bold(release === 'Unreleased' ? release : 'v' + release + ' - ' + date);
  },
  section: function (section) {
    current = section.toLowerCase();
    return sectionsColors[current]('  ' + section + ':');
  },
  message: function (message) {
    return sectionsColors[current]('    - ') + message;
  }
};
