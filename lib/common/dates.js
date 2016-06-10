'use strict';

module.exports = {
  format: function (date) {
    return (date instanceof Date && !isNaN(date.valueOf())) ? date.toISOString().split('T')[0] : 'unreleased';
  },
  parse: function (date) {
    if (!/\d{4}-\d{2}-\d{2}/.test(date)) {
      throw new Error('Date format must be YYYY-MM-DD');
    }

    return new Date(date);
  }
}
