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
  line:    new RegExp('^### (' + sections.join('|') + ')$', 'i')
};

module.exports = {
  ADDED:      'Added',
  CHANGED:    'Changed',
  DEPRECATED: 'Deprecated',
  REMOVED:    'Removed',
  FIXED:      'Fixed',
  SECURITY:   'Security'
};

module.exports.valid = function (section) {
  return regexps.section.test(section);
};

module.exports.after = function (section, include) {
  return sections.slice(sections.indexOf(section) + (include ? 0 : 1));
};

module.exports.test = function (line) {
  return regexps.line.test(line);
};

module.exports.extract = function (line) {
  var capture = regexps.line.exec(line);

  return (capture && capture.length > 1) ? capture[1] : null;
};
