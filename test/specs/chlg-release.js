'use strict';

var expect = require('chai').expect;
var fs     = require('fs');
var path   = require('path');

var chlgRelease = require('../../lib/chlg-release');

var fsUtils = require('../helpers/fs-utils');

var dataDir = path.resolve(__dirname, '../data');

var fixture = path.resolve(__dirname, '../fixtures/CHANGELOG-show.md');

function test(release, options, search, done) {
  if (typeof options === 'string') {
    done    = search;
    search  = options;
    options = null;
  }

  var callback = function (error) {
    if (error) {
      return done(error);
    }

    expect(error).to.equal(null);

    fs.readFile('CHANGELOG.md', {encoding: 'utf8'}, function (error, content) {
      if (error) {
        return done(error);
      }

      expect(content.indexOf(search)).to.not.equal(-1);
      done();
    });
  };

  if (options !== null) {
    chlgRelease(release, options, callback);
  } else {
    chlgRelease(release, callback);
  }
}

describe('chlg-release', function () {

  var date = new Date().toISOString().split('T')[0];

  before('Change CWD to test/data directory', function (done) {
    fsUtils.pushd(dataDir, done);
  });

  before('Delete files in /test/data directory', function (done) {
    fsUtils.clean(dataDir, done);
  });

  beforeEach(function (done) {
    fsUtils.copy(fixture, 'CHANGELOG.md', function (error) {
      return done(error);
    });
  });

  it('should add the release line in changelog', function (done) {
    var search = '## [Unreleased]\n\n## [1.0.0] - ' + date + '\n\n### Added';

    test('1.0.0', search, done);
  });

  it('should succeed with empty changelog', function (done) {
    var search = '## [Unreleased]\n\n## [1.0.0] - ' + date + '\n';

    fsUtils.copy(fixture.replace('-show.md', '-init.md'), 'CHANGELOG.md', function (error) {
      if (error) {
        return done(error);
      }

      test('1.0.0', search, done);
    });
  });

  it('should accept `major` increment', function (done) {
    var search = '## [Unreleased]\n\n## [1.0.0] - ' + date + '\n\n### Added';

    test('major', search, done);
  });

  it('should accept `minor` increment', function (done) {
    var search = '## [Unreleased]\n\n## [0.1.0] - ' + date + '\n\n### Added';

    test('minor', search, done);
  });

  it('should accept `patch` increment', function (done) {
    var search = '## [Unreleased]\n\n## [0.0.3] - ' + date + '\n\n### Added';

    test('patch', search, done);
  });

  it('should increment from zero version with empty changelog', function (done) {
    var search = '## [Unreleased]\n\n## [0.1.0] - ' + date + '\n';

    fsUtils.copy(fixture.replace('-show.md', '-init.md'), 'CHANGELOG.md', function (error) {
      if (error) {
        return done(error);
      }

      test('minor', search, done);
    });
  });

  it('should accept the `date` option', function (done) {
    var date   = new Date('2030-01-01').toISOString().split('T')[0];
    var search = '## [Unreleased]\n\n## [1.0.0] - ' + date + '\n\n### Added';

    test('1.0.0', {date: '2030-01-01'}, search, done);
  });

  it('should accept the `file` option', function (done) {
    chlgRelease('1.0.0', {file: 'NOT-EXIST.md'}, function (error) {
      expect(error).to.be.an('error');
      expect(error.code).to.equal('ENOENT');
      expect(error.path.split('\\').pop()).to.equal('NOT-EXIST.md');
      done();
    });
  });

  it('should return an error for invalid semver versions', function (done) {
    chlgRelease('Not a semver version', function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('‘Not a semver version’ is not valid semver version');
      done();
    });
  });

  it('should return an error for invalid date format', function (done) {
    chlgRelease('1.0.0', {date: 'Not a date'}, function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Date format must be YYYY-MM-DD');
      done();
    });
  });

  it('should return an error for invalid date format', function (done) {
    chlgRelease('1.0.0', {date: '1970-13-32'}, function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Invalid date: 1970-13-32');
      done();
    });
  });

  it('should return an error for lower releases than latest', function (done) {
    chlgRelease('0.0.1', function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Last release (0.0.2) is greater than 0.0.1');
      done();
    });
  });

  it('should return an error for dates prior to the latest', function (done) {
    chlgRelease('1.0.0', {date: '1970-01-01'}, function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('The release date is prior to the last (2012-12-21)');
      done();
    });
  });

  after('Delete files in /test/data directory', function (done) {
    fsUtils.clean(dataDir, done);
  });

  after('Restore CWD', function () {
    fsUtils.popd();
  });

});
