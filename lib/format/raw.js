'use strict';

/**
 * @module format/raw
 *
 * @description This module expose functions to format changelog line in a raw format.
 *
 * <pre>
 * ## [Unreleased][unreleased]
 * ### Added
 * - Add feature 4
 * - Add feature 5
 * ### Changed
 * - Change feature 2
 * ### Deprecated
 * - Deprecate feature 3
 * ### Removed
 * - Remove feature 1
 * ### Fixed
 * - Fix feature 3
 * ### Security
 * - Security advice
 * ## [v0.0.1][2015-11-12]
 * ### Added
 * - Add feature 1
 * - Add feature 2
 * - Add feature 3
 * </pre>
 */

var dates    = require('../common/dates');
var releases = require('../common/releases');

module.exports = {
  /**
   * Format a release number and date with in a raw format.
   *
   * @param  {string} release - Release number (semver version or 'UNRELEASED')
   * @param  {Date}   date    - Release date
   * @return {string} Formatted release line
   */
  release: function (release, date) {
    return (release === releases.UNRELEASED) ? '## [' + release + ']' : '## [' + release + '] - ' + dates.format(date);
  },

  /**
   * Format a section name with in a raw format.
   *
   * @param  {string} section - Section name
   * @return {string} Formatted section name
   */
  section: function (section) {
    return '### ' + section;
  },

  /**
   * Format a changelog message in a raw format.
   *
   * @param  {string} message - The changelog message
   * @return {string} Formatted changelog message
   */
  message: function (message) {
    return '- ' + message;
  }
};
