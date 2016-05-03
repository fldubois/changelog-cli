'use strict';

var util = require('util');

var Transform = require('stream').Transform;

var sections = require('./sections.js');

function ChangelogInsert(section, message, options) {
  if (!(this instanceof ChangelogInsert)) {
    return new ChangelogInsert(section, message, options);
  }

  Transform.call(this, options);

  this.section = section;
  this.message = '- ' + message.replace(/\n*$/, '\n');

  this.searches = {
    release: {
      begin: /^## \[Unreleased/,
      end:   /^## \[\d+/
    },
    section: {
      begin: new RegExp('^### ' + section),
      end:   new RegExp('^### (' + sections.after(section).join('|') + ')$')
    }
  };

  this.found = {
    release: {
      begin: false,
      end:   false
    },
    section: {
      begin: false,
      end:   false
    }
  };

  this.cache = [];
}

util.inherits(ChangelogInsert, Transform);

ChangelogInsert.prototype._transform = function (chunk, encoding, done) {
  if (!sections.valid(this.section)) {
    this.emit('error', new Error('\'' + this.section + '\' is not a valid change log section'));
  }

  var line = chunk.toString();

  if (this.found.release.begin && !this.found.release.end
  && !this.found.section.end && this.searches.release.end.test(line)) {
    this.found.release.end = true;
    this.insert();
  }

  if (this.found.release.begin && !this.found.release.end && !this.found.section.end) {
    if (this.searches.section.end.test(line)) {
      this.found.section.end = true;
      this.insert();
    }

    if (this.found.section.begin && line.length === 0) {
      this.cache.push('\n');
      return done();
    }

    if (!this.found.section.begin && this.searches.section.begin.test(line)) {
      this.found.section.begin = true;
    }
  }

  if (!this.found.release.begin && this.searches.release.begin.test(line)) {
    this.found.release.begin = true;
  }

  this.push(line + '\n');

  done();
};

ChangelogInsert.prototype.insert = function () {
  if (!this.found.section.begin) {
    if (!this.found.release.end && !this.found.section.end) {
      this.push('\n');
    }

    this.push('### ' + this.section + '\n');
  }

  this.push(this.message);

  this.cache.forEach(this.push, this);

  if (!this.found.section.begin && (this.found.release.end || this.found.section.end)) {
    this.push('\n');
  }
};

ChangelogInsert.prototype._flush = function (done) {
  if (!this.found.release.end && !this.found.section.end) {
    this.insert();
  }

  done();
};

module.exports = ChangelogInsert;
