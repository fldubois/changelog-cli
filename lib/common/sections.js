'use strict';

var sections = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security'
];

module.exports = {
  valid: function (section) {
    return sections.indexOf(section) !== -1;
  },
  after: function (section, include) {
    return sections.slice(sections.indexOf(section) + (include ? 0 : 1));
  }
}
