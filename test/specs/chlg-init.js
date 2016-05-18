'use strict';

var fs = require('fs');
var path  = require('path');
var spawnSync = require('child_process').spawnSync;

var expect = require('chai').expect;

var chlgInit = require('../../lib/chlg-init');

var dataDir = path.resolve(__dirname, '../data');

function checkChangelog(filename, done) {
  fs.readFile(filename, {encoding: 'utf8'}, function (err, content) {
    expect(err).to.not.exist;

    expect(content).to.equal([
      '# Change Log',
      'All notable changes to this project will be documented in this file.',
      'This project adheres to [Semantic Versioning](http://semver.org/).',
      '',
      '## [Unreleased][unreleased]',
      ''
    ].join('\n'));

    return done();
  });
}

describe('chlg-init', function () {

  before('Change CWD to test/data directory', function (done) {
    fs.stat(dataDir, function (err, stats) {
      if (err) {
        return done(err);
      }

      if (!stats.isDirectory()) {
        return done(new Error('test/data is not a directory'));
      }

      process.chdir(dataDir);

      return done();
    });
  });

  before('Delete files in /test/data directory', function (done) {
    fs.readdir(dataDir, function (err, files) {
      if (err) {
        return done(err);
      }

      files.forEach(function (file) {
        if (file !== '.gitkeep') {
          fs.unlinkSync(file);
        }
      });

      return done();
    })
  });

  describe('as a module', function () {

    var filename = 'CHANGELOG-module.md';

    it('should create a new changelog file', function (done) {
      chlgInit(filename, function (err) {
        expect(err).to.not.exist;
        checkChangelog(filename, done);
      });
    });

    it('should return error on existing file', function (done) {
      chlgInit(filename, function (err) {
        expect(err).to.exist;
        expect(err.message).to.equal('cannot create file ‘' + filename + '’: File exists');

        return done();
      });
    });

  });

  describe('as a command', function () {

    it('should create a new changelog file with default name', function (done) {
      var child = spawnSync(process.execPath, [path.resolve(__dirname, '../../lib/chlg-init.js')], {timeout: 1500});

      expect(child.status).to.equal(0);
      expect(child.stdout.toString()).to.equal('');
      expect(child.stderr.toString()).to.equal('');
      checkChangelog('CHANGELOG.md', done);
    });

    it('should create a new changelog file with custom name', function (done) {
      var child = spawnSync(process.execPath, [path.resolve(__dirname, '../../lib/chlg-init.js'), '-f', 'CHANGELOG-custom.md'], {timeout: 1500});

      expect(child.status).to.equal(0);
      expect(child.stdout.toString()).to.equal('');
      expect(child.stderr.toString()).to.equal('');
      checkChangelog('CHANGELOG-custom.md', done);
    });

    it('should exit with error status on existing file', function (done) {
      var child = spawnSync(process.execPath, [path.resolve(__dirname, '../../lib/chlg-init.js')], {timeout: 1500});

      expect(child.status).to.equal(1);
      expect(child.stdout.toString()).to.equal('');
      expect(child.stderr.toString()).to.equal('chlg-init: cannot create file ‘CHANGELOG.md’: File exists\n');

      return done();
    });

  });

  after('Delete files in /test/data directory', function (done) {
    fs.readdir(dataDir, function (err, files) {
      if (err) {
        return done(err);
      }

      files.forEach(function (file) {
        if (file !== '.gitkeep') {
          fs.unlinkSync(file);
        }
      });

      return done();
    })
  });

});
