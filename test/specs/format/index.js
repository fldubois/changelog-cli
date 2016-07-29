'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');

var format = proxyquire('../../../lib/format', {
  './brief.js': {
    release: function (release) {
      return release;
    },
    section: function () {
      return '';
    },
    message: function () {
      return null;
    }
  },
  './raw.js': {
    release: function () {
      throw new Error('Fake error');
    },
    section: function () {
      return '';
    },
    message: function () {
      return null;
    }
  }
});

var fixture = require('../../fixtures/logs');

describe('format', function () {

  it('should be a function', function () {
    expect(format).to.be.a('function');
  });

  it('should require the right format', function (done) {
    format('brief', fixture, function (error, lines) {
      if (error) {
        return done(error);
      }

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
      if (error) {
        return done(error);
      }

      expect(error).to.equal(null);
      expect(lines).to.equal(JSON.stringify(fixture, function (key, value) {
        if (key === 'date' && typeof value === 'string') {
          return value.split('T')[0];
        }

        return value;
      }, 2));
      done();
    });
  });

  it('should return error on unknown format', function (done) {
    format('false', fixture, function (error, lines) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('Unknown format: ‘false’');
      expect(lines).to.be.an('undefined');
      done();
    });
  });

  it('should return error on format error', function (done) {
    format('raw', fixture, function (error, lines) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('Fake error');
      expect(lines).to.be.an('undefined');
      done();
    });
  });

});
