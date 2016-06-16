'use strict';

var expect    = require('chai').expect;
var fs        = require('fs');
var path      = require('path');
var spawnSync = require('child_process').spawnSync;

var chlgInit    = require('../../lib/chlg-init');
var fileCompare = require('../helpers/file-compare');

var dataDir = path.resolve(__dirname, '../data');
var fixture = path.resolve(__dirname, '../fixtures/CHANGELOG-init.md');

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

        fileCompare(filename, fixture, function (err, match) {
          expect(err).to.not.exist;
          expect(match).to.equal(true);
          return done();
        });
      });
    });

    it('should return error on existing file', function (done) {
      chlgInit(filename, function (err) {
        expect(err).to.exist;
        expect(err.message).to.equal('Cannot create file ‘' + filename + '’: File exists');

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

      fileCompare('CHANGELOG.md', fixture, function (err, match) {
        expect(err).to.not.exist;
        expect(match).to.equal(true);
        done();
      });

    });

    it('should create a new changelog file with custom name', function (done) {
      var child = spawnSync(process.execPath, [path.resolve(__dirname, '../../lib/chlg-init.js'), '-f', 'CHANGELOG-custom.md'], {timeout: 1500});

      expect(child.status).to.equal(0);
      expect(child.stdout.toString()).to.equal('');
      expect(child.stderr.toString()).to.equal('');

      fileCompare('CHANGELOG-custom.md', fixture, function (err, match) {
        expect(err).to.not.exist;
        expect(match).to.equal(true);
        done();
      });
    });

    it('should exit with error status on existing file', function (done) {
      var child = spawnSync(process.execPath, [path.resolve(__dirname, '../../lib/chlg-init.js')], {timeout: 1500});

      expect(child.status).to.equal(1);
      expect(child.stdout.toString()).to.equal('');
      expect(child.stderr.toString()).to.equal('chlg-init: Cannot create file ‘CHANGELOG.md’: File exists\n');

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
