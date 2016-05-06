'use strict';

var util = require('util');

var Transform = require('stream').Transform;

function StreamInsert(insertions, search, prepend) {
  if (!(this instanceof StreamInsert)) {
    return new StreamInsert(insertions, search, prepend);
  }

  Transform.call(this);

  this.insertions = Array.isArray(insertions) ? insertions : [insertions];
  this.search     = search;
  this.prepend     = prepend || false;
  this.cache      = '';
}

util.inherits(StreamInsert, Transform);

StreamInsert.prototype._transform = function (chunk, encoding, done) {
  var lines = (this.cache + chunk.toString()).split('\n');

  this.cache = lines.pop();

  lines.forEach(function (line) {
    var pushes = [line];

    if (this.search.test(line)) {
      pushes[this.prepend ? 'unshift' : 'push'].apply(pushes, this.insertions);
    }

    this.push(pushes.join('\n') + '\n');
  }, this);

  done();
};

StreamInsert.prototype._flush = function (done) {
  var lines = [this.cache];

  if (this.search.test(this.cache)) {
    lines[this.prepend ? 'unshift' : 'push'].apply(lines, this.insertions);
  }

  this.push(lines.join('\n'));

  done();
};

module.exports = StreamInsert;
