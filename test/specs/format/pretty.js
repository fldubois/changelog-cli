'use strict';

var chalk  = require('chalk');
var expect = require('chai').expect;

var pretty = require('../../../lib/format/pretty');

describe('format/pretty', function () {

  it('should expose formatter interface', function () {
    expect(pretty.release).to.be.a('function');
    expect(pretty.section).to.be.a('function');
    expect(pretty.message).to.be.a('function');
  });

  it('should format release line', function () {
    expect(pretty.release('0.0.0', new Date('1970-01-01'))).to.equal(chalk.bold('v0.0.0 - 1970-01-01'));
    expect(pretty.release('Unreleased', 'unreleased')).to.equal(chalk.bold('Unreleased'));
  });

  it('should format section line', function () {
    expect(pretty.section('Added')).to.equal(chalk.green('  Added:'));
    expect(pretty.section('Changed')).to.equal(chalk.yellow('  Changed:'));
    expect(pretty.section('Deprecated')).to.equal(chalk.gray('  Deprecated:'));
    expect(pretty.section('Removed')).to.equal(chalk.red('  Removed:'));
    expect(pretty.section('Fixed')).to.equal(chalk.cyan('  Fixed:'));
    expect(pretty.section('Security')).to.equal(chalk.magenta('  Security:'));
  });

  it('should format message line', function () {
    pretty.section('Added');
    expect(pretty.message('Hello, friend.')).to.equal(chalk.green('    - ') + 'Hello, friend.');

    pretty.section('Changed');
    expect(pretty.message('Hello, friend.')).to.equal(chalk.yellow('    - ') + 'Hello, friend.');

    pretty.section('Deprecated');
    expect(pretty.message('Hello, friend.')).to.equal(chalk.gray('    - ') + 'Hello, friend.');

    pretty.section('Removed');
    expect(pretty.message('Hello, friend.')).to.equal(chalk.red('    - ') + 'Hello, friend.');

    pretty.section('Fixed');
    expect(pretty.message('Hello, friend.')).to.equal(chalk.cyan('    - ') + 'Hello, friend.');

    pretty.section('Security');
    expect(pretty.message('Hello, friend.')).to.equal(chalk.magenta('    - ') + 'Hello, friend.');
  });

});
