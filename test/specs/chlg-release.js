'use strict';

var expect = require('chai').expect;
var fs     = require('fs');
var path   = require('path');

var chlgRelease = require('../../lib/chlg-release');

var dataDir = path.resolve(__dirname, '../data');

var fixture = path.resolve(__dirname, '../fixtures/CHANGELOG-show.md');

var cwd = '';

function copy(source, target, callback) {
  var input  = fs.createReadStream(source);
  var output = fs.createWriteStream(target);

  input.on('error', callback);
  output.on('error', callback);
  output.on('close', callback);

  input.pipe(output);
}

function clean(callback) {
  fs.readdir(dataDir, function (error, files) {
    if (error) {
      return callback(error);
    }

    files.forEach(function (file) {
      if (file !== '.gitkeep') {
        fs.unlinkSync(file);
      }
    });

    return callback();
  });
}

describe('chlg-release', function () {

  before('Change CWD to test/data directory', function (done) {
    fs.stat(dataDir, function (error, stats) {
      if (error) {
        return done(error);
      }

      if (!stats.isDirectory()) {
        return done(new Error('test/data is not a directory'));
      }

      cwd = process.cwd();
      process.chdir(dataDir);

      return done();
    });
  });

  before('Delete files in /test/data directory', clean);

  beforeEach(function (done) {
    copy(fixture, 'CHANGELOG.md', function (error) {
      return done(error);
    });
  });

  it('should add the release line in changelog', function (done) {
    var date   = new Date().toISOString().split('T')[0];
    var search = '## [Unreleased][unreleased]\n\n## [1.0.0][' + date + ']\n\n### Added';

    chlgRelease('1.0.0', function (error) {
      expect(error).to.not.exist;

      fs.readFile('CHANGELOG.md', {encoding: 'utf8'}, function (err, content) {
        expect(error).to.not.exist;
        expect(content.indexOf(search)).to.not.equal(-1);
        done();
      });
    });
  });

  it('should succeed with empty changelog', function (done) {
    var date   = new Date().toISOString().split('T')[0];
    var search = '## [Unreleased][unreleased]\n\n## [1.0.0][' + date + ']\n';

    copy(fixture.replace('-show.md', '-init.md'), 'CHANGELOG.md', function (error) {
      expect(error).to.not.exist;

      chlgRelease('1.0.0', function (error) {
        expect(error).to.not.exist;

        fs.readFile('CHANGELOG.md', {encoding: 'utf8'}, function (err, content) {
          expect(error).to.not.exist;
          expect(content.indexOf(search)).to.not.equal(-1);
          done();
        });
      });
    });
  });

  it('should accept the `date` option', function (done) {
    var date   = new Date('2030-01-01').toISOString().split('T')[0];
    var search = '## [Unreleased][unreleased]\n\n## [1.0.0][' + date + ']\n\n### Added';

    chlgRelease('1.0.0', {date: '2030-01-01'}, function (error) {
      expect(error).to.not.exist;

      fs.readFile('CHANGELOG.md', {encoding: 'utf8'}, function (err, content) {
        expect(error).to.not.exist;
        expect(content.indexOf(search)).to.not.equal(-1);
        done();
      });
    });
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
      expect(error.message).to.equal('Not a semver version is not valid semver version');
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
      expect(error.message).to.equal('invalid date: 1970-13-32');
      done();
    });
  });

  it('should return an error for lower releases than latest', function (done) {
    chlgRelease('0.0.1', function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('last release (0.0.2) is greater than 0.0.1');
      done();
    });
  });

  it('should return an error for dates prior to the latest', function (done) {
    chlgRelease('1.0.0', {date: '1970-01-01'}, function (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('the release date is prior to the last (2012-12-21)');
      done();
    });
  });

  after('Delete files in /test/data directory', clean);

  after('Restore CWD', function () {
    process.chdir(cwd);
  });

});
