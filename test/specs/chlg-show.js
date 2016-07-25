'use strict';

var expect    = require('chai').expect;
var path      = require('path');

var chlgShow = require('../../lib/chlg-show');

var fsUtils = require('../helpers/fs-utils');

var dataDir = path.resolve(__dirname, '../data');

var fixtures = {
  valid: path.resolve(__dirname, '../fixtures/CHANGELOG-show.md'),
  empty: path.resolve(__dirname, '../fixtures/CHANGELOG-init.md'),
  logs:  require('../fixtures/logs.js')
};

function filter(logs, releases, sections) {
  var filtered = {};

  Object.keys(logs).forEach(function (release) {
    if (releases.indexOf(release) !== -1) {
      if (!sections) {
        filtered[release] = logs[release];
      } else {
        var filteredSections = {};

        Object.keys(logs[release].sections).forEach(function (section) {
          if (sections.indexOf(section) !== -1) {
            filteredSections[section] = logs[release].sections[section];
          }
        });

        filtered[release] = {
          date:     logs[release].date,
          sections: filteredSections
        };
      }
    }
  });

  return filtered;
}

describe('chlg-show', function () {

  before('Change CWD to test/data directory', function (done) {
    fsUtils.pushd(dataDir, done);
  });

  it('should read logs from changelog file', function (done) {
    chlgShow({file: fixtures.valid}, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['Unreleased']));
      done();
    });
  });

  it('should use CHANGELOG.md as default file name', function (done) {
    chlgShow(function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.code).to.equal('ENOENT');
      expect(error.path).to.match(/(\/|\\)CHANGELOG.md$/);
      expect(logs).to.be.an('undefined');
      done();
    });
  });

  it('should filter sections', function (done) {
    chlgShow({
      file: fixtures.valid,
      sections: ['Added', 'deprecated', 'FIXED']
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['Unreleased'], ['Added', 'Deprecated', 'Fixed']));
      done();
    });
  });

  it('should filter releases', function (done) {
    chlgShow({
      file: fixtures.valid,
      releases: ['0.0.2']
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['0.0.2']));
      done();
    });
  });

  it('should filter releases by range', function (done) {
    chlgShow({
      file: fixtures.valid,
      releases: ['0.0.x']
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['0.0.1', '0.0.2']));
      done();
    });
  });

  it('should accept "all" as release option', function (done) {
    chlgShow({
      file: fixtures.valid,
      releases: ['all']
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(fixtures.logs);
      done();
    });
  });

  it('should accept "latest" as release option', function (done) {
    chlgShow({
      file: fixtures.valid,
      releases: ['latest']
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['0.0.2']));
      done();
    });
  });

  it('should filter releases with "from" option', function (done) {
    chlgShow({
      file:     fixtures.valid,
      releases: ['all'],
      from:     '2000-01-01'
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['Unreleased', '0.0.2']));
      done();
    });
  });

  it('should filter releases with "to" option', function (done) {
    chlgShow({
      file:     fixtures.valid,
      releases: ['all'],
      to:       '2000-01-01'
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['0.0.1']));
      done();
    });
  });

  it('should filter releases with "from" and "to" option', function (done) {
    chlgShow({
      file:     fixtures.valid,
      releases: ['all'],
      from:     '2000-01-01',
      to:       '2014-01-01'
    }, function (error, logs) {
      expect(error).to.equal(null);
      expect(logs).to.deep.equal(filter(fixtures.logs, ['0.0.2']));
      done();
    });
  });

  it('should return an error on bad release number', function (done) {
    chlgShow({
      file: fixtures.valid,
      releases: ['Not a release']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('‘Not a release’ is not valid semver version/range');
      expect(logs).to.be.an('undefined');
      done();
    });
  });

  it('should return an error on bad section name', function (done) {
    chlgShow({
      file: fixtures.valid,
      sections: ['Bad']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('‘bad’ is not valid changelog section');
      expect(logs).to.be.an('undefined');
      done();
    });
  });

  it('should return an error with no matching release found', function (done) {
    chlgShow({
      file: fixtures.empty,
      releases: ['0.0.1']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('No matching release found');
      expect(logs).to.be.an('undefined');
      done();
    });
  });

  it('should return an error for "latest" with no releases in changelog', function (done) {
    chlgShow({
      file: fixtures.empty,
      releases: ['latest']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('No matching release found');
      expect(logs).to.be.an('undefined');
      done();
    });
  });

  it('should return an error for bad format on "from" parameter', function (done) {
    chlgShow({
      file: fixtures.valid,
      from: 'Not a date'
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Date format must be YYYY-MM-DD');
      expect(logs).to.be.an('undefined');
      done();
    });
  });

  it('should return an error for bad format on "to" parameter', function (done) {
    chlgShow({
      file: fixtures.valid,
      to:   'Not a date'
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Date format must be YYYY-MM-DD');
      expect(logs).to.be.an('undefined');
      done();
    });
  });

  after('Restore CWD', function () {
    fsUtils.popd();
  });

});
