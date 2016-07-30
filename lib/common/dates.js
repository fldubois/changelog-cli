'use strict';

/**
 * @module common/dates
 */

module.exports = {

  /**
   * Format a date to the YYYY-MM-DD format.
   *
   * @param  {Date}   date - The Date instance to format
   * @return {string} The YYYY-MM-DD string representation of the date, or null if the date is not valid
   */
  format: function (date) {
    return (date instanceof Date && !isNaN(date.valueOf())) ? date.toISOString().split('T')[0] : null;
  },

  /**
   * Parse a date string with the YYYY-MM-DD format
   *
   * @param  {string} date - The date string
   * @return {Date}   A Date instance
   *
   * @throws {Error} Throws an error if the date string is not in YYYY-MM-DD format
   */
  parse: function (date) {
    if (!/\d{4}-\d{2}-\d{2}/.test(date)) {
      throw new Error('Date format must be YYYY-MM-DD');
    }

    return new Date(date);
  },

  /**
   * Determines if a date is inside a date range.
   *
   * @param  {Date}    date - The date to test
   * @param  {Date}    from - The beginning of the range
   * @param  {Date}    to   - The end of the range
   * @return {boolean} True if the date is in the range, false otherwise.
   */
  isBetween: function (date, from, to) {
    if (date === null) {
      return (to === null);
    }

    if (from !== null && date.getTime() < from.getTime()) {
      return false;
    }

    if (to !== null && date.getTime() > to.getTime()) {
      return false;
    }

    return true;
  }

};
