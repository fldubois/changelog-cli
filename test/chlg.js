'use strict';

var path  = require('path');
var spawnSync = require('child_process').spawnSync;

var expect = require('chai').expect;

var chlg = require('../lib/chlg');

var commands = [
  'init',
  'release',
  'show',
  'insert',
  'add',
  'change',
  'deprecate',
  'remove',
  'fix',
  'security'
];

describe('chlg', function() {

  describe('as a module', function() {

    commands.forEach(function (command) {
      it('should export chlg-' + command, function () {
        expect(chlg[command]).to.be.a('function');
      });
    });

  });

  describe('as a command', function() {

    it('should show the chlg version', function () {
      var child = spawnSync(process.execPath, [path.resolve(__dirname, '../lib/chlg.js'), 'version'], {timeout: 1500});

      expect(child.status).to.equal(0);
      expect(child.stdout.toString().replace('\n', '')).to.equal(require('../package.json').version);
    });

    it('should show the help message', function () {
      var child = spawnSync(process.execPath, [path.resolve(__dirname, '../lib/chlg.js'), 'help'], {timeout: 1500});

      expect(child.status).to.equal(0);
      expect(child.stdout.toString()).to.have.string('Usage: chlg [options] [command]');
    });

    commands.forEach(function (command) {
      it('should support the command ' + command, function () {
        var child = spawnSync(process.execPath, [path.resolve(__dirname, '../lib/chlg.js'), 'help', command], {timeout: 1500});

        expect(child.status).to.equal(0);
        expect(child.stdout.toString()).to.have.string('Usage: chlg-' + command);
      });
    });

  });

});
