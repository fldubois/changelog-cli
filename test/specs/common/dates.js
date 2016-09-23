'use strict';

var expect = require('chai').expect;

var dates = require('../../../lib/common/dates');

describe('common/dates', function () {

  it('should expose utils functions', function () {
    expect(dates.format).to.be.a('function');
  });

  describe('format', function () {

    it('should return formatted date for Date instances', function () {
      expect(dates.format(new Date('1970-01-01'))).to.equal('1970-01-01');
      expect(dates.format(new Date('2012-12-21'))).to.equal('2012-12-21');
      expect(dates.format(new Date('2048-10-24'))).to.equal('2048-10-24');
    });

    it('should return null for bad values', function () {
      expect(dates.format(true)).to.equal(null);
      expect(dates.format(false)).to.equal(null);
      expect(dates.format(NaN)).to.equal(null);
      expect(dates.format(0)).to.equal(null);
      expect(dates.format(-1)).to.equal(null);
      expect(dates.format(null)).to.equal(null);
      expect(dates.format(undefined)).to.equal(null);
      expect(dates.format('')).to.equal(null);
      expect(dates.format('Hello')).to.equal(null);
      expect(dates.format()).to.equal(null);
      expect(dates.format(Date.now())).to.equal(null);
      expect(dates.format(new Date('Invalid'))).to.equal(null);
      expect(dates.format(new Date('1970-01-32'))).to.equal(null);
    });

  });

  describe('parse', function () {

    it('should return Date instance for correctly formatted date string', function () {
      var test = function (string) {
        var date = dates.parse(string);

        expect(date).to.be.instanceof(Date);
        expect(date.getTime()).to.not.eql(NaN);
      };

      test('1970-01-01');
      test('2012-12-21');
      test('2048-10-24');
    });

    it('should throw an error for bad formatted string', function () {
      expect(dates.parse(true)).to.equal(null);
      expect(dates.parse(false)).to.equal(null);
      expect(dates.parse(NaN)).to.equal(null);
      expect(dates.parse(0)).to.equal(null);
      expect(dates.parse(-1)).to.equal(null);
      expect(dates.parse(null)).to.equal(null);
      expect(dates.parse(undefined)).to.equal(null);
      expect(dates.parse('')).to.equal(null);
      expect(dates.parse('Hello')).to.equal(null);
      expect(dates.parse(Date.now())).to.equal(null);
      expect(dates.parse(new Date('Invalid'))).to.equal(null);
      expect(dates.parse(new Date('1970-01-32'))).to.equal(null);
      expect(dates.parse(new Date())).to.equal(null);
    });

    it('should return "Invalid Date" for incorrect date', function () {
      var test = function (string) {
        var date = dates.parse(string);

        expect(date).to.be.instanceof(Date);
        expect(date.getTime()).to.eql(NaN);
      };

      test('1970-01-32');
      test('2012-25-21');
      test('2048-15-36');
    });

  });

  describe('isBetween', function () {
    var from = new Date('2000-01-01');
    var to   = new Date('2010-01-01');

    it('should return true for dates in period', function () {
      expect(dates.isBetween(new Date('2005-01-01'), from, to)).to.equal(true);
      expect(dates.isBetween(new Date('2000-01-01'), from, to)).to.equal(true);
      expect(dates.isBetween(new Date('2010-01-01'), from, to)).to.equal(true);
    });

    it('should return true for null `date` and `to` parameters', function () {
      expect(dates.isBetween(null, from, null)).to.equal(true);
    });

    it('should return false for dates before period', function () {
      expect(dates.isBetween(new Date('1999-12-31'), from, to)).to.equal(false);
      expect(dates.isBetween(new Date('1970-01-01'), from, to)).to.equal(false);
    });

    it('should return false for dates after period', function () {
      expect(dates.isBetween(new Date('2015-01-01'), from, to)).to.equal(false);
      expect(dates.isBetween(new Date('2010-01-02'), from, to)).to.equal(false);
    });

  });

});
