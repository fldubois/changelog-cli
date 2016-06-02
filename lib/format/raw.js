'use strict';

var dates = require('../common/dates');

module.exports = {
  release: function (release, date) {
    return '## [' + release + '][' + dates.format(date) + ']';
  },
  section: function (section) {
    return '### ' + section;
  },
  message: function (message) {
    return '- ' + message;
  }
};
