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
    end: new RegExp('^(### (' + sections.slice(sections.indexOf(section) + 1).join('|') + '))?$')
  };

  this.found = {
    release: false,
    section: false,
    end: false
  };
}

util.inherits(ChangelogInsert, Transform);

ChangelogInsert.prototype._transform = function (chunk, encoding, done) {
  var line = chunk.toString();

  if (!this.found.release && this.searches.release.test(line)) {
    this.found.release = true;
  }

  if (this.found.release && !this.found.section && this.searches.section.test(line)) {
    this.found.section = true;
  }

  if (this.found.release && !this.found.end && this.searches.end.test(line)) {
    this.found.end = true;

    line = this.message + line;

    if (!this.found.section) {
      line = '\n### ' + this.section + '\n' + line;
    }
  }

  this.push(line + '\n');

  done();
};

module.exports = ChangelogInsert;
