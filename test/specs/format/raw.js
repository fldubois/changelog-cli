'use strict';

var expect = require('chai').expect;

var raw = require('../../../lib/format/raw');

describe('format/raw', function() {

  it('should expose formatter interface', function () {
    expect(raw.release).to.be.a('function');
    expect(raw.section).to.be.a('function');
    expect(raw.message).to.be.a('function');
  });

  it('should format release line', function () {
    expect(raw.release('0.0.0', new Date('1970-01-01'))).to.equal('## [0.0.0][1970-01-01]');
    expect(raw.release('Unreleased', 'unreleased')).to.equal('## [Unreleased][unreleased]');
  });

  it('should format section line', function () {
    expect(raw.section('Added')).to.equal('### Added');
    expect(raw.section('Changed')).to.equal('### Changed');
    expect(raw.section('Deprecated')).to.equal('### Deprecated');
    expect(raw.section('Removed')).to.equal('### Removed');
    expect(raw.section('Fixed')).to.equal('### Fixed');
    expect(raw.section('Security')).to.equal('### Security');
  });

  it('should format message line', function () {
    expect(raw.message('Hello, friend.')).to.equal('- Hello, friend.');
  });

});
