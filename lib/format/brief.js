'use strict';

var chalk = require('chalk');

var releases = require('../common/releases');

var symbols = {
  added:      chalk.bold.green('+'),
  changed:    chalk.bold.yellow('±'),
  deprecated: chalk.bold.gray('×'),
  removed:    chalk.bold.red('-'),
  fixed:      chalk.bold.cyan('#'),
  security:   chalk.bold.magenta('!')
};

var current = null;

module.exports = {
  release: function (release, date) {
    return chalk.bold(release === releases.UNRELEASED ? release : 'v' + release + ' - ' + date);
  },
  section: function (section) {
    current = section.toLowerCase();
  },
  message: function (message) {
    return ' ' + symbols[current] + ' ' + message;
  }
};
