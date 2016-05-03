'use strict';

var regexp = /^## \[(Unreleased|\d+\.\d+\.\d+)\]\[(unreleased|\d{4}-\d{2}-\d{2})\]/;

module.exports = {
  test: function (line) {
    return regexp.test(line);
  },
  extract: function (line) {
    var capture = regexp.exec(line);

    return (capture && capture.length > 1) ? {version: capture[1], date: capture[2] || null} : null;
  }
};
