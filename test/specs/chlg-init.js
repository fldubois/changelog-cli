'use strict';

var expect     = require('chai').expect;
var path       = require('path');
var proxyquire = require('proxyquire');

var chlgInit = require('../../lib/chlg-init');

var fsUtils = require('../helpers/fs-utils');

var dataDir = path.resolve(__dirname, '../data');
var fixture = path.resolve(__dirname, '../fixtures/CHANGELOG-init.md');

var filename = 'CHANGELOG-module.md';

describe('chlg-init', function () {

  before('Change CWD to test/data directory', function (done) {
    fsUtils.pushd(dataDir, done);
  });

  before('Delete files in /test/data directory', function (done) {
    fsUtils.clean(dataDir, done);
  });

  it('should create a new changelog file', function (done) {
    chlgInit(filename, function (error) {
      if (error) {
        return done(error);
      }

      expect(error).to.equal(null);

      fsUtils.compare(filename, fixture, function (error, match) {
        if (error) {
          return done(error);
        }

        expect(match).to.equal(true);

        return done();
      });
    });
  });

  it('should use \'CHANGELOG.md\' as default filename', function (done) {
    chlgInit(function (error) {
      if (error) {
        return done(error);
      }

      expect(error).to.equal(null);

      fsUtils.compare('CHANGELOG.md', fixture, function (error, match) {
        if (error) {
          return done(error);
        }

        expect(match).to.equal(true);

        return done();
      });
    });
  });

  it('should return error on existing file', function (done) {
    chlgInit(filename, function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Cannot create file ‘' + filename + '’: File exists');

      return done();
    });
  });

  it('should return error on bad \'file\' parameter type', function (done) {
    chlgInit(1, function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Parameter ‘file’ must be a string');

      return done();
    });
  });

  it('should return file writing error', function (done) {
    // Fix the 'possible EventEmitter memory leak detected' warning
    require('events').defaultMaxListeners = 15;

    var chlgInit = proxyquire('../../lib/chlg-init', {
      fs: {
        writeFile: function (file, data, options, callback) {
          return callback(new Error('Fake error'));
        }
      }
    });

    chlgInit('CHANGELOG-error.md', function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Cannot create file ‘CHANGELOG-error.md’: Fake error');

      return done();
    });
  });

  after('Delete files in /test/data directory', function (done) {
    fsUtils.clean(dataDir, done);
  });

  after('Restore CWD', function () {
    fsUtils.popd();
  });

});
