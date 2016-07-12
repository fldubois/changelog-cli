'use strict';

/**
 * @module chlg-add
 */

var chlgInsert = require('./chlg-insert');
var sections   = require('./common/sections.js');

/**
 * @typedef  {object} Options
 * @property {string} file - The change log filename/path
 */

/**
 * Add a new message in the 'Added' section.
 *
 * @param {string}   message  - The message to insert in the 'Added' section
 * @param {Options}  options  - Options
 * @param {Function} callback - Callback invoked with an optional error after the message inserted in the change log
 */
module.exports = function (message, options, callback) {
  chlgInsert(sections.ADDED, message, options, callback);
};
