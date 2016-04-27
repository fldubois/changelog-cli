'use strict';

var symbols = {
  added:      '+',
  changed:    '±',
  deprecated: '×',
  removed:    '-',
  fixed:      '#',
  security:   '!'
};

var current = null;

module.exports = {
  release: function (release, date) {
    return (release === 'Unreleased' ? release : 'v' + release + ' - ' + date);
  },
  section: function (section) {
    current = section.toLowerCase();
  },
  message: function (message) {
    return ' ' + symbols[current] + ' ' + message;
  }
}
