'use strict';

module.exports = {
  release: function (release, date) {
    return (release === 'Unreleased' ? release : 'v' + release + ' - ' + date);
  },
  section: function (section) {
    return '  ' + section + ':';
  },
  message: function (message) {
    return '    - ' + message;
  }
}
