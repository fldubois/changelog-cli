'use strict';

var sections = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security'
];

var regexps = {
  section: new RegExp('^(' + sections.join('|') + ')$', 'i'),
  line: new RegExp('^### (' + sections.join('|') + ')$', 'i')
};

module.exports = {
  valid: function (section) {
    return regexps.section.test(section);
  },
  after: function (section, include) {
    return sections.slice(sections.indexOf(section) + (include ? 0 : 1));
  },
  test: function (line) {
    return regexps.line.test(line);
  },
  extract: function (line) {
    var capture = regexps.line.exec(line);
    return (capture && capture.length > 1) ? capture[1] : null;
  }
}
