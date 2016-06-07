'use strict';

var expect = require('chai').expect;

var dates = require('../../../lib/common/dates');

describe('common/dates', function() {

  it('should expose utils functions', function () {
    expect(dates.format).to.be.a('function');
  });

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
