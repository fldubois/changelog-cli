'use strict';

module.exports = {
  format: function (date) {
    return (date instanceof Date && !isNaN(date.valueOf())) ? date.toISOString().split('T')[0] : 'unreleased';
  }
}
