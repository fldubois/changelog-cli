'use strict';

module.exports = function (format, logs, callback) {
  if (format === 'json') {
    console.log(JSON.stringify(logs, null, 2));
    return callback();
  }

  try {
    var formatter = require('./' + format + '.js');
  } catch (error) {
    var message = (error.code === 'MODULE_NOT_FOUND') ? 'unknown format \'' + format + '\'' : error.message;
    return callback(new Error(message));
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
