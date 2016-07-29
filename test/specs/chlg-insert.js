'use strict';

var expect = require('chai').expect;
var path   = require('path');

var chlgInsert = require('../../lib/chlg-insert');

var fsUtils = require('../helpers/fs-utils');

var dataDir  = path.resolve(__dirname, '../data');
var fixtures = path.resolve(__dirname, '../fixtures');

describe('chlg-insert', function () {

  before('Change CWD to test/data directory', function (done) {
    fsUtils.pushd(dataDir, done);
  });

  before('Delete files in /test/data directory', function (done) {
    fsUtils.clean(dataDir, done);
  });

  it('should insert message in the right section', function (done) {
    fsUtils.copy(path.join(fixtures, 'CHANGELOG-show.md'), 'CHANGELOG.md', function (error) {
      if (error) {
        return done(error);
      }

      chlgInsert('Changed', 'Change feature 6', function (error) {
        if (error) {
          return done(error);
        }

        expect(error).to.equal(null);

        fsUtils.compare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-message.md'), function (error, match) {
          if (error) {
            return done(error);
          }

          expect(match).to.equal(true);

          return done();
        });
      });
    });
  });

  it('should use \'CHANGELOG.md\' as default filename', function (done) {
    fsUtils.copy(path.join(fixtures, 'CHANGELOG-show.md'), 'CHANGELOG.md', function (error) {
      if (error) {
        return done(error);
      }

      chlgInsert('Changed', 'Change feature 6', function (error) {
        if (error) {
          return done(error);
        }

        expect(error).to.equal(null);

        fsUtils.compare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-message.md'), function (error, match) {
          if (error) {
            return done(error);
          }

          expect(match).to.equal(true);

          return done();
        });
      });
    });
  });

  it('should create section if necessary', function (done) {
    fsUtils.copy(path.join(fixtures, 'CHANGELOG-show.md'), 'CHANGELOG.md', function (error) {
      if (error) {
        return done(error);
      }

      chlgInsert('Security', 'Feature 5', function (error) {
        if (error) {
          return done(error);
        }

        expect(error).to.equal(null);

        fsUtils.compare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-section.md'), function (error, match) {
          if (error) {
            return done(error);
          }

          expect(match).to.equal(true);

          return done();
        });
      });
    });
  });

  it('should insert the first section and message', function (done) {
    fsUtils.copy(path.join(fixtures, 'CHANGELOG-init.md'), 'CHANGELOG.md', function (error) {
      if (error) {
        return done(error);
      }

      chlgInsert('Added', 'Add feature 1', function (error) {
        if (error) {
          return done(error);
        }

        expect(error).to.equal(null);

        fsUtils.compare('CHANGELOG.md', path.join(fixtures, 'CHANGELOG-insert-first.md'), function (error, match) {
          if (error) {
            return done(error);
          }

          expect(match).to.equal(true);

          return done();
        });
      });
    });
  });

  it('should return error on bad section name', function (done) {
    chlgInsert('Not a section', 'Message', function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('‘Not a section’ is not a valid change log section');

      return done();
    });
  });

  it('should return error on file not found', function (done) {
    chlgInsert('Added', 'Message', {file: 'CHANGELOG-NOT-HERE.md'}, function (error) {
      expect(error).to.be.an('error');
      expect(error.code).to.equal('ENOENT');
      expect(error.path).to.match(/(\/|\\)CHANGELOG-NOT-HERE.md$/);

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
