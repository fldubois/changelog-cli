'use strict';

var expect = require('chai').expect;

var dates = require('../../../lib/common/dates');

describe('common/dates', function() {

  it('should expose utils functions', function () {
    expect(dates.format).to.be.a('function');
  });

  describe('format', function () {

    it('should return formatted date for Date instances', function () {
      expect(dates.format(new Date('1970-01-01'))).to.equal('1970-01-01');
      expect(dates.format(new Date('2012-12-21'))).to.equal('2012-12-21');
      expect(dates.format(new Date('2048-10-24'))).to.equal('2048-10-24');
    });

    it('should return "unreleased" for bad values', function () {
      expect(dates.format(true)).to.equal('unreleased');
      expect(dates.format(false)).to.equal('unreleased');
      expect(dates.format(NaN)).to.equal('unreleased');
      expect(dates.format(0)).to.equal('unreleased');
      expect(dates.format(-1)).to.equal('unreleased');
      expect(dates.format(null)).to.equal('unreleased');
      expect(dates.format(undefined)).to.equal('unreleased');
      expect(dates.format('')).to.equal('unreleased');
      expect(dates.format('Hello')).to.equal('unreleased');
      expect(dates.format()).to.equal('unreleased');
      expect(dates.format(Date.now())).to.equal('unreleased');
      expect(dates.format(new Date('Invalid'))).to.equal('unreleased');
      expect(dates.format(new Date('1970-01-32'))).to.equal('unreleased');
    });

  });

  describe('parse', function () {

    it('should return Date instance for correctly formatted date string', function () {
      var test = function (string) {
        var date = dates.parse(string);
        expect(date).to.be.instanceof(Date);
        expect(date.getTime()).to.not.be.NaN;
      };

      test('1970-01-01');
      test('2012-12-21');
      test('2048-10-24');
    });

    it('should throw an error for bad formatted string', function () {
      var error = 'Date format must be YYYY-MM-DD';

      expect(dates.parse.bind(undefined, true)).to.throw(error);
      expect(dates.parse.bind(undefined, false)).to.throw(error);
      expect(dates.parse.bind(undefined, NaN)).to.throw(error);
      expect(dates.parse.bind(undefined, 0)).to.throw(error);
      expect(dates.parse.bind(undefined, -1)).to.throw(error);
      expect(dates.parse.bind(undefined, null)).to.throw(error);
      expect(dates.parse.bind(undefined, undefined)).to.throw(error);
      expect(dates.parse.bind(undefined, '')).to.throw(error);
      expect(dates.parse.bind(undefined, 'Hello')).to.throw(error);
      expect(dates.parse.bind(undefined, Date.now())).to.throw(error);
      expect(dates.parse.bind(undefined, new Date('Invalid'))).to.throw(error);
      expect(dates.parse.bind(undefined, new Date('1970-01-32'))).to.throw(error);
      expect(dates.parse.bind(undefined, new Date())).to.throw(error);
    });

    it('should return "Invalid Date" for incorrect date', function () {
      var test = function (string) {
        var date = dates.parse(string);
        expect(date).to.be.instanceof(Date);
        expect(date.getTime()).to.be.NaN;
      };

      test('1970-01-32');
      test('2012-25-21');
      test('2048-15-36');
    });

  });

});
