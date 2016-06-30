'use strict';

var path  = require('path');
var spawnSync = require('child_process').spawnSync;

var expect = require('chai').expect;

var chlg = require('../../lib/chlg');

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

  commands.forEach(function (command) {
    it('should export chlg-' + command, function () {
      expect(chlg[command]).to.be.a('function');
    });
  });

});
