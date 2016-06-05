'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');

var format = proxyquire('../../../lib/format', {
  './brief.js': {
    release: function (release, date) {
      return release;
    },
    section: function (section) {
      return '';
    },
    message: function (message) {
      return null;
    }
  },
  './raw.js': {
    release: function (release, date) {
      throw new Error('Fake error');
    },
    section: function (section) {
      return '';
    },
    message: function (message) {
      return null;
    }
  }
});

var fixture = require('../../fixtures/logs');

describe('format', function() {

  it('should be a function', function () {
    expect(format).to.be.a('function');
  });

  it('should require the right format', function (done) {
    format('brief', fixture, function (error, lines) {
      expect(error).to.equal(null);
      expect(lines).to.equal([
        'Unreleased',
        '0.0.2',
        '0.0.1'
      ].join('\n'));
      done();
    });
  });

  it('should accept "json" format', function (done) {
    format('json', fixture, function (error, lines) {
      expect(error).to.equal(null);
      expect(lines).to.equal(JSON.stringify(fixture, null, 2));
      done();
    });
  });

  it('should return error on unknown format', function (done) {
    format('false', fixture, function (error, lines) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('unknown format \'false\'');
      expect(lines).to.not.exists;
      done();
    });
  });

  it('should return error on format error', function (done) {
    format('raw', fixture, function (error, lines) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('Fake error');
      expect(lines).to.not.exists;
      done();
    });
  });

});
