'use strict';

var expect = require('chai').expect;

var releases = require('../../../lib/common/releases');

describe('common/releases', function() {

  it('should expose the unreleased label', function () {
    expect(releases.UNRELEASED).to.be.a('string');
  });

  it('should expose utils functions', function () {
    expect(releases.test).to.be.a('function');
    expect(releases.extract).to.be.a('function');
  });

  describe('test', function () {

    it('should return true for valid section header', function () {
      expect(releases.test('## [' + releases.UNRELEASED + '][unreleased]')).to.equal(true);
      expect(releases.test('## [0.0.0][1970-01-01]')).to.equal(true);
      expect(releases.test('## [12.2.57][2014-01-25]')).to.equal(true);
    });

    it('should return false for bad section header', function () {
      expect(releases.test(true)).to.equal(false);
      expect(releases.test(false)).to.equal(false);
      expect(releases.test(NaN)).to.equal(false);
      expect(releases.test(0)).to.equal(false);
      expect(releases.test(-1)).to.equal(false);
      expect(releases.test(null)).to.equal(false);
      expect(releases.test(undefined)).to.equal(false);
      expect(releases.test('')).to.equal(false);
      expect(releases.test('Hello')).to.equal(false);

      expect(releases.test('## [0.1][1970-01-01]')).to.equal(false);
      expect(releases.test('## [0.0.0.1][1970-01-01]')).to.equal(false);
      expect(releases.test('## 0.0.0[1970-01-01]')).to.equal(false);
      expect(releases.test('## [0.0.0]1970-01-01')).to.equal(false);
      expect(releases.test('## 0.0.0 1970-01-01')).to.equal(false);
      expect(releases.test('## [0.0.0][1970-1-01]')).to.equal(false);
      expect(releases.test('## [0.0.0][1970-01-1]')).to.equal(false);
      expect(releases.test('## [0.0.0][1970-01]')).to.equal(false);
      expect(releases.test('# [0.0.0][1970-01-01]')).to.equal(false);
      expect(releases.test('[0.0.0][1970-01-01]')).to.equal(false);
    });

  });

  describe('extract', function () {

    it('should extract the section name for a valid section header', function () {
      var extract1 = releases.extract('## [' + releases.UNRELEASED + '][unreleased]');

      expect(extract1).to.be.an('object');
      expect(extract1).to.deep.equal({version: releases.UNRELEASED, date: 'unreleased'});

      var extract3 = releases.extract('## [0.0.0][1970-01-01]');

      expect(extract3).to.be.an('object');
      expect(extract3).to.deep.equal({version: '0.0.0', date: '1970-01-01'});

      var extract4 = releases.extract('## [12.2.57][2014-01-25]');

      expect(extract4).to.be.an('object');
      expect(extract4).to.deep.equal({version: '12.2.57', date: '2014-01-25'});
    });

    it('should return null for bad section header', function () {
      expect(releases.extract(true)).to.equal(null);
      expect(releases.extract(false)).to.equal(null);
      expect(releases.extract(NaN)).to.equal(null);
      expect(releases.extract(0)).to.equal(null);
      expect(releases.extract(-1)).to.equal(null);
      expect(releases.extract(null)).to.equal(null);
      expect(releases.extract(undefined)).to.equal(null);
      expect(releases.extract('')).to.equal(null);
      expect(releases.extract('Hello')).to.equal(null);

      expect(releases.extract('## [0.1][1970-01-01]')).to.equal(null);
      expect(releases.extract('## [0.0.0.1][1970-01-01]')).to.equal(null);
      expect(releases.extract('## 0.0.0[1970-01-01]')).to.equal(null);
      expect(releases.extract('## [0.0.0]1970-01-01')).to.equal(null);
      expect(releases.extract('## 0.0.0 1970-01-01')).to.equal(null);
      expect(releases.extract('## [0.0.0][1970-1-01]')).to.equal(null);
      expect(releases.extract('## [0.0.0][1970-01-1]')).to.equal(null);
      expect(releases.extract('## [0.0.0][1970-01]')).to.equal(null);
      expect(releases.extract('# [0.0.0][1970-01-01]')).to.equal(null);
      expect(releases.extract('[0.0.0][1970-01-01]')).to.equal(null);
    });

  });

});
