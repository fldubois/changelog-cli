'use strict';

var sections = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security'
];

var regexp = new RegExp('^(' + sections.join('|') + ')$', 'i');

module.exports = {
  valid: function (section) {
    return regexp.test(section);
  },
  after: function (section, include) {
    return sections.slice(sections.indexOf(section) + (include ? 0 : 1));
  }
}
