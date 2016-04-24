'use strict';

module.exports = {
  release: function (release, date) {
    return '## [' + release + '][' + date + ']';
  },
  section: function (section) {
    return '### ' + section;
  },
  message: function (message) {
    return '- ' + message;
  }
}
