'use strict';

var regexp = /^## \[(Unreleased|\d+\.\d+\.\d+)\]/

module.exports = {
  test: function (line) {
    return regexp.test(line);
  },
  extract: function (line) {
    var capture = regexp.exec(line);
    return (capture && capture.length > 1) ? capture[1] : null;
  }
}
