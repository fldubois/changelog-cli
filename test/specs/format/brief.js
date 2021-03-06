'use strict';

var chalk  = require('chalk');
var expect = require('chai').expect;

var brief = require('../../../lib/format/brief');

describe('format/brief', function () {

  it('should expose formatter interface', function () {
    expect(brief.release).to.be.a('function');
    expect(brief.section).to.be.a('function');
    expect(brief.message).to.be.a('function');
  });

  it('should format release line', function () {
    expect(brief.release('0.0.0', new Date('1970-01-01'))).to.equal(chalk.bold('v0.0.0 - 1970-01-01'));
    expect(brief.release('Unreleased', 'unreleased')).to.equal(chalk.bold('Unreleased'));
  });

  it('should format message line in section \'Added\'', function () {
    brief.section('Added');
    expect(brief.message('Hello, friend.')).to.equal(' ' + chalk.bold.green('+') + ' Hello, friend.');
  });

  it('should format message line in section \'Changed\'', function () {
    brief.section('Changed');
    expect(brief.message('Hello, friend.')).to.equal(' ' + chalk.bold.yellow('±') + ' Hello, friend.');
  });

  it('should format message line in section \'Deprecated\'', function () {
    brief.section('Deprecated');
    expect(brief.message('Hello, friend.')).to.equal(' ' + chalk.bold.gray('×') + ' Hello, friend.');
  });

  it('should format message line in section \'Removed\'', function () {
    brief.section('Removed');
    expect(brief.message('Hello, friend.')).to.equal(' ' + chalk.bold.red('-') + ' Hello, friend.');
  });

  it('should format message line in section \'Fixed\'', function () {
    brief.section('Fixed');
    expect(brief.message('Hello, friend.')).to.equal(' ' + chalk.bold.cyan('#') + ' Hello, friend.');
  });

  it('should format message line in section \'Security\'', function () {
    brief.section('Security');
    expect(brief.message('Hello, friend.')).to.equal(' ' + chalk.bold.magenta('!') + ' Hello, friend.');
  });

});
