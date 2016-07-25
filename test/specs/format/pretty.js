'use strict';

var expect = require('chai').expect;

var pretty = require('../../../lib/format/pretty');

describe('format/pretty', function () {

  it('should expose formatter interface', function () {
    expect(pretty.release).to.be.a('function');
    expect(pretty.section).to.be.a('function');
    expect(pretty.message).to.be.a('function');
  });

  it('should format release line', function () {
    expect(pretty.release('0.0.0', new Date('1970-01-01'))).to.equal('v0.0.0 - 1970-01-01');
    expect(pretty.release('Unreleased', 'unreleased')).to.equal('Unreleased');
  });

  it('should format section line', function () {
    expect(pretty.section('Added')).to.equal('  Added:');
    expect(pretty.section('Changed')).to.equal('  Changed:');
    expect(pretty.section('Deprecated')).to.equal('  Deprecated:');
    expect(pretty.section('Removed')).to.equal('  Removed:');
    expect(pretty.section('Fixed')).to.equal('  Fixed:');
    expect(pretty.section('Security')).to.equal('  Security:');
  });

  it('should format message line', function () {
    pretty.section('Added');
    expect(pretty.message('Hello, friend.')).to.equal('    - Hello, friend.');

    pretty.section('Changed');
    expect(pretty.message('Hello, friend.')).to.equal('    - Hello, friend.');

    pretty.section('Deprecated');
    expect(pretty.message('Hello, friend.')).to.equal('    - Hello, friend.');

    pretty.section('Removed');
    expect(pretty.message('Hello, friend.')).to.equal('    - Hello, friend.');

    pretty.section('Fixed');
    expect(pretty.message('Hello, friend.')).to.equal('    - Hello, friend.');

    pretty.section('Security');
    expect(pretty.message('Hello, friend.')).to.equal('    - Hello, friend.');
  });

});
