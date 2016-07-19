'use strict';

var fs = require('fs');

var stack = [process.cwd()];

module.exports = {
  push: function (path, callback) {
    fs.stat(path, function (err, stats) {
      if (err) {
        return callback(err);
      }

      if (!stats.isDirectory()) {
        return callback(new Error(path + ' is not a directory'));
      }

      stack.push(process.cwd());

      process.chdir(path);

      return callback();
    });
  },
  pop: function (callback) {
    process.chdir(stack.length > 1 ? stack.pop() : stack[0]);
  }
}
