'use strict';

var util = require('util');

var Transform = require('stream').Transform;

function StreamInsert(insertions, search, before) {
  if (!(this instanceof StreamInsert)) {
    return new StreamInsert(section, message);
  }

  Transform.call(this);

  this.insertions = Array.isArray(insertions) ? insertions : [insertions];
  this.search     = search;
  this.before     = before || false;
}

util.inherits(StreamInsert, Transform);

StreamInsert.prototype._transform = function (chunk, encoding, done) {
  var line = chunk.toString();

  if (this.search.test(line) && this.before) {
    this.insertions.forEach(function (insertion) {
      this.push(insertion + '\n');
    }, this);
  }

  this.push(line + '\n');

  if (this.search.test(line) && !this.before) {
    this.insertions.forEach(function (insertion) {
      this.push(insertion + '\n');
    }, this);
  }

  done();
};

module.exports = StreamInsert;
