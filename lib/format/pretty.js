'use strict';

/**
 * @module format/pretty
 */

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
  /**
   * Format a release number and date with in a pretty format.
   *
   * @param  {string} release - Release number (semver version or 'UNRELEASED')
   * @param  {Date}   date    - Release date
   * @return {string} Formatted release line
   */
  release: function (release, date) {
    return chalk.bold(release === releases.UNRELEASED ? release : 'v' + release + ' - ' + dates.format(date));
  },

  /**
   * Format a section name with in a pretty format.
   *
   * @param {string} section - Section name
   */
  section: function (section) {
    current = section.toLowerCase();

    return sectionsColors[current]('  ' + section + ':');
  },

  /**
   * Format a changelog message in a pretty format.
   *
   * @param  {string} message - The changelog message
   * @return {string} Formatted changelog message
   */
  message: function (message) {
    return sectionsColors[current]('    - ') + message;
  }
};
