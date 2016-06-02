'use strict';

var chalk = require('chalk');

var dates    = require('../common/dates');
var releases = require('../common/releases');

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
    return chalk.bold(release === releases.UNRELEASED ? release : 'v' + release + ' - ' + dates.format(date));
  },
  section: function (section) {
    current = section.toLowerCase();
    return sectionsColors[current]('  ' + section + ':');
  },
  message: function (message) {
    return sectionsColors[current]('    - ') + message;
  }
};
