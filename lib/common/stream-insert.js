'use strict';

var util = require('util');

var Transform = require('stream').Transform;

function StreamInsert(insertions, search, before) {
  if (!(this instanceof StreamInsert)) {
    return new StreamInsert(insertions, search, before);
  }

  Transform.call(this);

  this.insertions = Array.isArray(insertions) ? insertions : [insertions];
  this.search     = search;
  this.before     = before || false;
  this.cache      = '';
}

util.inherits(StreamInsert, Transform);

StreamInsert.prototype._transform = function (chunk, encoding, done) {
  var lines = (this.cache + chunk.toString()).split('\n');

  this.cache = lines.pop();

  lines.forEach(function (line) {
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
  }, this);

  done();
};

StreamInsert.prototype._flush = function (done) {
  var line = this.cache;

  if (this.search.test(line) && this.before) {
    this.insertions.forEach(function (insertion) {
      this.push(insertion + '\n');
    }, this);
  }

  this.push(line);

  if (this.search.test(line) && !this.before) {
    this.insertions.forEach(function (insertion) {
      this.push('\n' + insertion);
    }, this);
  }

  done();
};

module.exports = StreamInsert;
