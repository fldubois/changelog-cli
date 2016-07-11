'use strict';

/**
 * @module format/raw
 */

var dates = require('../common/dates');

module.exports = {
  /**
   * Format a release number and date with in a raw format.
   *
   * @param  {string} release - Release number (semver version or 'UNRELEASED')
   * @param  {Date}   date    - Release date
   * @return {string} Formatted release line
   */
  release: function (release, date) {
    return '## [' + release + '][' + dates.format(date) + ']';
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
