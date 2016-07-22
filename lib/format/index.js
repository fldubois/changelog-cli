'use strict';

/**
 * @module format/index
 */

var dates = require('../common/dates');

/**
 * @typedef  {object}                   ChangelogRelease
 * @property {string}                   date     - Release date (YYYY-MM-DD format or 'unrealeased')
 * @property {object<string, string[]>} sections - The changelog messages indexed by section name
 */

/**
 * @callback formatCallback
 * @param    {Error}    - Optional error
 * @param    {string[]} - Formatted lines
 */

/**
 * Adds a line to an array if it is not empty.
 *
 * @private
 *
 * @param {string[]} lines - Array of lines where the line should be added
 * @param {string}   line  - The line to append
 */
function addLine(lines, line) {
  if (typeof line === 'string' && line.length > 0) {
    lines.push(line);
  }
}

/**
 * Add a new message in the 'Added' section
 *
 * @param  {string}                           format   - Format to use
 * @param  {object<string, ChangelogRelease>} logs     - Changelog releases indexed by release number
 * @param  {formatCallback}                   callback - Callback invoked with the formatted lines
 */
module.exports = function (format, logs, callback) {
  if (format === 'json') {
    return callback(null, JSON.stringify(logs, function (key, value) {
      if (key === 'date' && typeof value === 'string') {
        return dates.format(new Date(value));
      }

      return value;
    }, 2));
  }

  var lines = [];

  try {
    var formatter = require('./' + format + '.js');

    Object.keys(logs).forEach(function (release) {
      addLine(lines, formatter.release(release, logs[release].date));

      Object.keys(logs[release].sections).forEach(function (section) {
        addLine(lines, formatter.section(section));

        logs[release].sections[section].forEach(function (message) {
          addLine(lines, formatter.message(message));
        });
      });
    });
  } catch (error) {
    var message = (error.code === 'MODULE_NOT_FOUND') ? 'Unknown format: ‘' + format + '’' : error.message;

    return callback(new Error(message));
  }


  return callback(null, lines.join('\n'));
};
