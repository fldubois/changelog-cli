'use strict';

var fs = require('fs');

module.exports = function (source, target, callback) {
  var input  = fs.createReadStream(source);
  var output = fs.createWriteStream(target);

  input.on('error', callback);
  output.on('error', callback);
  output.on('close', callback);

  input.pipe(output);
}
