'use strict';

/**
 * @module common/releases
 */

/**
 * Contains the informations about a release.
 * @typedef {object} ReleaseDescriptor
 * @property {string} version - Release number (semver version or 'Unrealeased')
 * @property {string} date    - Release date (YYYY-MM-DD format or 'unrealeased')
 */

var regexp = /^## \[(Unreleased|\d+\.\d+\.\d+)\]( - (\d{4}-\d{2}-\d{2}))?$/;

var VERSION_INDEX = 1;
var DATE_INDEX    = 3;

module.exports = {
  /**
   * Label for version in development
   * @constant {string}
   */
  UNRELEASED: 'Unreleased',

  /**
   * Test if a string is a correctly formatted release line.
   *
   * @param  {string}  line - The release line to test
   * @return {boolean} true if the line is correctly formatted, false otherwise
   */
  test: function (line) {
    return regexp.test(line);
  },

  /**
   * Extract the release informations from the line.
   *
   * @param  {string}  line - The release line to test
   * @return {ReleaseDescriptor} The release informations if the line is correctly formatted, null otherwise
   */
  extract: function (line) {
    var capture = regexp.exec(line);

    if (capture && capture.length > 1) {
      return {
        version: capture[VERSION_INDEX],
        date:    /\d{4}-\d{2}-\d{2}/.test(capture[DATE_INDEX]) ? new Date(capture[DATE_INDEX]) : null
      };
    }

    return null;
  }

};
