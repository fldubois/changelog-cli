'use strict';

/**
 * @module format/brief
 *
 * @description This module expose functions to format changelog line in a brief format.
 *
 * <pre>
 * Unreleased
 *  + Add feature 4
 *  + Add feature 5
 *  ± Change feature 2
 *  × Deprecate feature 3
 *  - Remove feature 1
 *  # Fix feature 3
 *  ! Security advice
 * v0.0.1 - 2015-11-12
 *  + Add feature 1
 *  + Add feature 2
 *  + Add feature 3
 * </pre>
 */

var chalk = require('chalk');

var dates    = require('../common/dates');
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
  /**
   * Format a release number and date with in a brief format.
   *
   * @param  {string} release - Release number (semver version or 'UNRELEASED')
   * @param  {Date}   date    - Release date
   * @return {string} Formatted release line
   */
  release: function (release, date) {
    return chalk.bold(release === releases.UNRELEASED ? release : 'v' + release + ' - ' + dates.format(date));
  },

  /**
   * Format a section name with in a brief format.
   *
   * @param {string} section - Section name
   */
  section: function (section) {
    current = section.toLowerCase();
  },

  /**
   * Format a changelog message in a brief format.
   *
   * @param  {string} message - The changelog message
   * @return {string} Formatted changelog message
   */
  message: function (message) {
    return ' ' + symbols[current] + ' ' + message;
  }
};
