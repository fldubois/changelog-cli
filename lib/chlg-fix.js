'use strict';

/**
 * @module chlg-fix
 */

var chlgInsert = require('./chlg-insert');
var sections   = require('./common/sections.js');

/**
 * @typedef  {object} Options
 * @property {string} [file=CHANGELOG.md] - The change log filename/path
 */

/**
 * Add a new message in the 'Fixed' section.
 *
 * @param {string}   message   - The message to insert in the 'Fixed' section
 * @param {Options}  [options] - Options
 * @param {Function} callback  - Callback invoked with an optional error after the message inserted in the change log
 */
module.exports = function (message, options, callback) {
  chlgInsert(sections.FIXED, message, options, callback);
};
