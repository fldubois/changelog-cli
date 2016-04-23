'use strict';

module.exports = {
  release: function (release) {
    return '## [' + release + ']';
  },
  section: function (section) {
    return '### ' + section;
  },
  message: function (message) {
    return '- ' + message;
  }
}
