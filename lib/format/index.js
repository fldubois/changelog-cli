'use strict';

function addLine(lines, message) {
  if (typeof message === 'string' && message.length > 0) {
    lines.push(message);
  }
}

module.exports = function (format, logs, callback) {
  if (format === 'json') {
    return callback(null, JSON.stringify(logs, null, 2));
  }

  var lines = [];

  try {
    var formatter = require('./' + format + '.js');

    Object.keys(logs).forEach(function (release) {
      addLine(lines, formatter.release(release, logs[release].date));

      Object.keys(logs[release].sections).forEach(function (section) {
        addLine(lines, formatter.section(section));

        logs[release].sections[section].forEach(function (message) {
          addLine(lines, formatter.message(message));
        });
      });
    });
  } catch (error) {
    var message = (error.code === 'MODULE_NOT_FOUND') ? 'Unknown format: ‘' + format + '’' : error.message;

    return callback(new Error(message));
  }


  return callback(null, lines.join('\n'));
};
