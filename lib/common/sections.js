'use strict';

/**
 * @module common/sections
 */

var sections = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security'
];

var regexps = {
  section: new RegExp('^(' + sections.join('|') + ')$', 'i'),
  line:    new RegExp('^### (' + sections.join('|') + ')$', 'i')
};

/** @constant {string} ADDED      - 'Added' section label      */
/** @constant {string} CHANGED    - 'Changed' section label    */
/** @constant {string} DEPRECATED - 'Deprecated' section label */
/** @constant {string} REMOVED    - 'Removed' section label    */
/** @constant {string} FIXED      - 'Fixed' section label      */
/** @constant {string} SECURITY   - 'Security' section label   */

module.exports = {
  ADDED:      'Added',
  CHANGED:    'Changed',
  DEPRECATED: 'Deprecated',
  REMOVED:    'Removed',
  FIXED:      'Fixed',
  SECURITY:   'Security',

  /**
   * Test if a string is a correct section name (case insensitive).
   *
   * @param  {string}  section - The section name
   * @return {boolean} true if the parameter is a correct section name, false otherwise
   */
  valid: function (section) {
    return regexps.section.test(section);
  },

  /**
   * Return the capitalized section name.
   *
   * @param  {string} section - The section name
   * @return {string} Capitilized section name for correct parameter, null otherwise
   */
  clean: function (section) {
    if (regexps.section.test(section)) {
      return section[0].toUpperCase() + section.substring(1).toLowerCase();
    }

    return null;
  },

  /**
   * Get all section names coming after the specified section in the change log.
   *
   * @param  {string}   section   - The section name
   * @param  {boolean}  [include] - Include the specified section name in the array if true
   * @return {string[]} An Array containing section names
   *
   * @throws {Error} Throws an error if the section name is not valid
   */
  after: function (section, include) {
    var cleaned = module.exports.clean(section);

    return (cleaned === null) ? null : sections.slice(sections.indexOf(cleaned) + (include ? 0 : 1));
  },

  /**
   * Test if a string is a correctly formatted section line.
   *
   * @param  {string}  line - The section line to test
   * @return {boolean} true if the line is correctly formatted, false otherwise
   */
  test: function (line) {
    return regexps.line.test(line);
  },

  /**
   * Extract the section name from a change log line.
   *
   * @param  {string} line - The section change log line
   * @return {string} The section name if the line is correctly formatted, null otherwise
   */
  extract: function (line) {
    var capture = regexps.line.exec(line);

    return (capture && capture.length > 1) ? capture[1] : null;
  }

};
