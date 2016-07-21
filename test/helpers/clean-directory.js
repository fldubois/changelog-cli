'use strict';

var fs = require('fs');

module.exports = function (path, ignores, callback) {
  if (typeof path !== 'string') {
    callback = ignores;
    ignores  = path;
    path     = process.cwd();
  }

  if (typeof ignores === 'function') {
    callback = ignores;
    ignores  = ['.gitkeep'];
  }

  fs.readdir(path, function (error, files) {
    if (error) {
      return callback(error);
    }

    files.forEach(function (file) {
      if (ignores.indexOf(file) === -1) {
        fs.unlinkSync(file);
      }
    });

    return callback();
  });
}
