'use strict';

var expect = require('chai').expect;
var fs     = require('fs');
var path   = require('path');

var chlgInsert = require('../../lib/chlg-insert');

var cleanDirectory = require('../helpers/clean-directory');
var dirstack       = require('../helpers/dirstack');
var fileCompare    = require('../helpers/file-compare');
var fileCopy       = require('../helpers/file-copy');

var dataDir  = path.resolve(__dirname, '../data');
var fixtures = path.resolve(__dirname, '../fixtures');

describe('chlg-insert', function () {

  before('Change CWD to test/data directory', function (done) {
    dirstack.push(dataDir, done);
  });

  var filename = 'CHANGELOG-module.md';

  before('Delete files in /test/data directory', function (done) {
    cleanDirectory(dataDir, done);
  });

  it('should insert message in the right section', function (done) {
    fileCopy(path.join(fixtures, 'CHANGELOG-show.md'), 'CHANGELOG.md', function (error) {
      expect(error).to.not.exist;

      chlgInsert('Changed', 'Change feature 6', function (error) {
        expect(error).to.not.exist;

        fileCompare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-message.md'), function (error, match) {
          expect(error).to.not.exist;
          expect(match).to.equal(true);
          return done();
        });
      });
    });
  });

  it('should use \'CHANGELOG.md\' as default filename', function (done) {
    fileCopy(path.join(fixtures, 'CHANGELOG-show.md'), 'CHANGELOG.md', function (error) {
      expect(error).to.not.exist;

      chlgInsert('Changed', 'Change feature 6', function (error) {
        expect(error).to.not.exist;

        fileCompare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-message.md'), function (error, match) {
          expect(error).to.not.exist;
          expect(match).to.equal(true);
          return done();
        });
      });
    });
  });

  it('should create section if necessary', function (done) {
    fileCopy(path.join(fixtures, 'CHANGELOG-show.md'), 'CHANGELOG.md', function (error) {
      expect(error).to.not.exist;

      chlgInsert('Security', 'Feature 5', function (error) {
        expect(error).to.not.exist;

        fileCompare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-section.md'), function (error, match) {
          expect(error).to.not.exist;
          expect(match).to.equal(true);
          return done();
        });
      });
    });
  });

  it('should insert the first section and message', function (done) {
    fileCopy(path.join(fixtures, 'CHANGELOG-init.md'), 'CHANGELOG.md', function (error) {
      expect(error).to.not.exist;

      chlgInsert('Added', 'Add feature 1', function (error) {
        expect(error).to.not.exist;

        fileCompare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-first.md'), function (error, match) {
          expect(error).to.not.exist;
          expect(match).to.equal(true);
          return done();
        });
      });
    });
  });

  it('should return error on bad section name', function (done) {
    chlgInsert('Not a section', 'Message', function (error) {
      expect(error).to.exist;
      expect(error.message).to.equal('‘Not a section’ is not a valid change log section');

      return done();
    });
  });

  it('should return error on file not found', function (done) {
    chlgInsert('Added', 'Message', {file: 'CHANGELOG-NOT-HERE.md'}, function (error) {
      expect(error).to.exist;
      expect(error.code).to.equal('ENOENT');
      expect(error.path).to.match(/(\/|\\)CHANGELOG-NOT-HERE.md$/);

      return done();
    });
  });

  after('Delete files in /test/data directory', function (done) {
    cleanDirectory(dataDir, done);
  });

  after('Restore CWD', function () {
    dirstack.pop();
  });

});
