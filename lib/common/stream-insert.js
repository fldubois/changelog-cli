'use strict';

var util = require('util');

var Transform = require('stream').Transform;

function StreamInsert(insertions, searches, prepend) {
  if (!(this instanceof StreamInsert)) {
    return new StreamInsert(insertions, searches, prepend);
  }

  Transform.call(this);

  this.insertions = Array.isArray(insertions) ? insertions : [insertions];
  this.searches   = Array.isArray(searches) ? searches : [searches];
  this.current    = 0;
  this.prepend    = prepend || false;
  this.cache      = '';
}

util.inherits(StreamInsert, Transform);

StreamInsert.prototype._transform = function (chunk, encoding, done) {
  var lines = (this.cache + chunk.toString()).split('\n');

  this.cache = lines.pop();

  lines.forEach(function (line) {
    var pushes = [line];

    if (this.searches[this.current].test(line)) {
      this.current = (this.current + 1) % this.searches.length;

      if (this.current === 0) {
        pushes[this.prepend ? 'unshift' : 'push'].apply(pushes, this.insertions);
      }
    }

    this.push(pushes.join('\n') + '\n');
  }, this);

  done();
};

StreamInsert.prototype._flush = function (done) {
  var lines = [this.cache];

  if (this.searches[this.current].test(this.cache)) {
    this.current = (this.current + 1) % this.searches.length;

    if (this.current === 0) {
      lines[this.prepend ? 'unshift' : 'push'].apply(lines, this.insertions);
    }
  } else if (this.searches[this.current].test('\u0003')) {
    this.current = (this.current + 1) % this.searches.length;

    if (this.current === 0) {
      lines.push.apply(lines, this.insertions);
    }
  }

  this.push(lines.join('\n'));

  done();
};

module.exports = StreamInsert;
