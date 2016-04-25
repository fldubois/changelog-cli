'use strict';

module.exports = function (format, logs, callback) {
  try {
    var formatter = require('./' + format + '.js');
  } catch (error) {
    return callback(new Error('unknown format \'' + format + '\''));
  }

  Object.keys(logs).forEach(function (release) {
    console.log(formatter.release(release, logs[release].date));

    Object.keys(logs[release].sections).forEach(function (section) {
      console.log(formatter.section(section));

      logs[release].sections[section].forEach(function (message) {
        console.log(formatter.message(message));
      });
    });
  });

  return callback();
}
