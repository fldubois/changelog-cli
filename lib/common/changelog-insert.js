'use strict';

var util = require('util');

var Transform = require('stream').Transform;

var sections = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security'
];

function ChangelogInsert(section, message, options) {
  if (!(this instanceof ChangelogInsert)) {
    return new ChangelogInsert(section, message, options);
  }

  Transform.call(this, options);

  this.section = section;
  this.message = '- ' + message.replace(/\n*$/, '\n');

  this.searches = {
    release: /^## \[Unreleased/,
    section: new RegExp('^### ' + section),
    end: new RegExp('^### (' + sections.slice(sections.indexOf(section) + 1).join('|') + ')$')
  };

  this.found = {
    release: false,
    section: false,
    end: false
  };

  this.cache = [];
}

util.inherits(ChangelogInsert, Transform);

ChangelogInsert.prototype._transform = function (chunk, encoding, done) {
  var line = chunk.toString();

  if (this.found.release && !this.found.end) {

    if (this.searches.end.test(line)) {
      this.found.end = true;
      this._insert();
    }

    if (this.found.section && line.length === 0) {
      this.cache.push('\n');
      return done();
    }

    if (!this.found.section && this.searches.section.test(line)) {
      this.found.section = true;
    }

  }

  if (!this.found.release && this.searches.release.test(line)) {
    this.found.release = true;
  }

  this.push(line + '\n');

  done();
};

ChangelogInsert.prototype._insert = function() {
  if (!this.found.section) {
    if (!this.found.end) {
      this.push('\n');
    }

    this.push('### ' + this.section + '\n');
  }

  this.push(this.message);

  this.cache.forEach(this.push, this);

  if (!this.found.section && this.found.end) {
    this.push('\n');
  }
};

ChangelogInsert.prototype._flush = function(done) {

  if (!this.found.end) {
    this._insert();
  }

  done();
};

module.exports = ChangelogInsert;
