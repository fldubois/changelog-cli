'use strict';

var expect = require('chai').expect;

var sections = require('../../lib/common/sections');

describe('common/sections', function() {

  it('should expose sections names', function () {
    expect(sections.ADDED).to.be.a('string');
    expect(sections.CHANGED).to.be.a('string');
    expect(sections.DEPRECATED).to.be.a('string');
    expect(sections.REMOVED).to.be.a('string');
    expect(sections.FIXED).to.be.a('string');
    expect(sections.SECURITY).to.be.a('string');
  });

  it('should expose utils functions', function () {
    expect(sections.valid).to.be.a('function');
    expect(sections.after).to.be.a('function');
    expect(sections.test).to.be.a('function');
    expect(sections.extract).to.be.a('function');
  });

  describe('valid', function () {

    it('should return true for valid section names', function () {
      expect(sections.valid('ADDED')).to.equal(true);
      expect(sections.valid('changed')).to.equal(true);
      expect(sections.valid('DePrEcAtEd')).to.equal(true);
      expect(sections.valid('Removed')).to.equal(true);
      expect(sections.valid('FixeD')).to.equal(true);
      expect(sections.valid(sections.SECURITY)).to.equal(true);
    });

    it('should return false for bad section names', function () {
      expect(sections.valid(true)).to.equal(false);
      expect(sections.valid(false)).to.equal(false);
      expect(sections.valid(NaN)).to.equal(false);
      expect(sections.valid(0)).to.equal(false);
      expect(sections.valid(-1)).to.equal(false);
      expect(sections.valid(null)).to.equal(false);
      expect(sections.valid(undefined)).to.equal(false);
      expect(sections.valid('')).to.equal(false);
      expect(sections.valid('Hello')).to.equal(false);
      expect(sections.valid('ADDEDD')).to.equal(false);
    });

  });

  describe('after', function () {

    var scenarios = {
      'Added':    ['Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'],
      'Removed':  ['Fixed', 'Security'],
      'Security': []
    };

    it('should return the list of next sections', function () {
      Object.keys(scenarios).forEach(function (section) {
        expect(sections.after(section)).to.deep.equal(scenarios[section]);
      });
    });

    it('should support the include parameter', function () {
      Object.keys(scenarios).forEach(function (section) {
        expect(sections.after(section, true)).to.deep.equal([section].concat(scenarios[section]));
      });
    });

    it('should throw an error for not valid section names');

  });

  describe('test', function () {

    it('should return true for valid section header', function () {
      expect(sections.test('### ADDED')).to.equal(true);
      expect(sections.test('### changed')).to.equal(true);
      expect(sections.test('### DePrEcAtEd')).to.equal(true);
      expect(sections.test('### Removed')).to.equal(true);
      expect(sections.test('### FixeD')).to.equal(true);
      expect(sections.test('### ' + sections.SECURITY)).to.equal(true);
    });

    it('should return false for bad section header', function () {
      expect(sections.test(true)).to.equal(false);
      expect(sections.test(false)).to.equal(false);
      expect(sections.test(NaN)).to.equal(false);
      expect(sections.test(0)).to.equal(false);
      expect(sections.test(-1)).to.equal(false);
      expect(sections.test(null)).to.equal(false);
      expect(sections.test(undefined)).to.equal(false);
      expect(sections.test('')).to.equal(false);
      expect(sections.test('Hello')).to.equal(false);

      expect(sections.test('Added')).to.equal(false);
      expect(sections.test('# Added')).to.equal(false);
      expect(sections.test('## Added')).to.equal(false);
      expect(sections.test('#### Added')).to.equal(false);

      expect(sections.test('### Added ')).to.equal(false);
    });

  });

  describe('extract', function () {

    it('should extract the section name for a valid section header', function () {
      expect(sections.extract('### ADDED')).to.equal('ADDED');
      expect(sections.extract('### changed')).to.equal('changed');
      expect(sections.extract('### DePrEcAtEd')).to.equal('DePrEcAtEd');
      expect(sections.extract('### Removed')).to.equal('Removed');
      expect(sections.extract('### FixeD')).to.equal('FixeD');
      expect(sections.extract('### ' + sections.SECURITY)).to.equal(sections.SECURITY);
    });

    it('should return null for bad section header', function () {
      expect(sections.extract(true)).to.equal(null);
      expect(sections.extract(false)).to.equal(null);
      expect(sections.extract(NaN)).to.equal(null);
      expect(sections.extract(0)).to.equal(null);
      expect(sections.extract(-1)).to.equal(null);
      expect(sections.extract(null)).to.equal(null);
      expect(sections.extract(undefined)).to.equal(null);
      expect(sections.extract('')).to.equal(null);
      expect(sections.extract('Hello')).to.equal(null);

      expect(sections.extract('Added')).to.equal(null);
      expect(sections.extract('# Added')).to.equal(null);
      expect(sections.extract('## Added')).to.equal(null);
      expect(sections.extract('#### Added')).to.equal(null);

      expect(sections.extract('### Added ')).to.equal(null);
    });

  });

});
