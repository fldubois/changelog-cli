'use strict';

var fs = require('fs');

module.exports = function (fileA, fileB, callback) {
  fs.readFile(fileA, {encoding: 'utf8'}, function (err, contentA) {
    if (err) {
      return callback(err);
    }

    fs.readFile(fileB, {encoding: 'utf8'}, function (err, contentB) {
      if (err) {
        return callback(err);
      }

      return callback(null, contentA === contentB);
    });
  });
}
