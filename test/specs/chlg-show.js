'use strict';

var expect    = require('chai').expect;
var fs        = require('fs');
var path      = require('path');
var spawnSync = require('child_process').spawnSync;

var chlgShow = require('../../lib/chlg-show');

var dataDir = path.resolve(__dirname, '../data');
var fixture = {
  valid: path.resolve(__dirname, '../fixtures/CHANGELOG-show.md'),
  empty: path.resolve(__dirname, '../fixtures/CHANGELOG-init.md')
};

var cwd = '';

describe('chlg-show', function () {

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

  it('should read logs from changelog file', function (done) {
    chlgShow({file: fixture.valid}, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        'Unreleased': {
          date: null,
          sections: {
            'Added': [
              'Add feature 6',
              'Add feature 7',
              'Add feature 8'
            ],
            'Changed': [
              'Change feature 5'
            ],
            'Deprecated': [
              'Deprecate feature 1'
            ],
            'Removed': [
              'Remove feature 2'
            ],
            'Fixed': [
              'Fix feature 3',
              'Fix feature 4'
            ]
          }
        }
      });

      done();
    });
  });

  it('should use CHANGELOG.md as default file name', function (done) {
    chlgShow(function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.code).to.equal('ENOENT');
      expect(error.path).to.match(/(\/|\\)CHANGELOG.md$/);
      done();
    });
  });

  it('should filter sections', function (done) {
    chlgShow({
      file: fixture.valid,
      sections: ['Added', 'deprecated', 'FIXED']
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        'Unreleased': {
          date: null,
          sections: {
            'Added': [
              'Add feature 6',
              'Add feature 7',
              'Add feature 8'
            ],
            'Deprecated': [
              'Deprecate feature 1'
            ],
            'Fixed': [
              'Fix feature 3',
              'Fix feature 4'
            ]
          }
        }
      });

      done();
    });
  });

  it('should filter releases', function (done) {
    chlgShow({
      file: fixture.valid,
      releases: ['0.0.2']
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        '0.0.2': {
          date: new Date('2012-12-21'),
          sections: {
            'Added': [
              'Add feature 4',
              'Add feature 5'
            ],
            'Changed': [
              'Change feature 2'
            ],

            'Fixed': [
              'Fix feature 3'
            ],

            'Security': [
              'Feature 1'
            ]
          }
        }
      });

      done();
    });
  });

  it('should filter releases by range', function (done) {
    chlgShow({
      file: fixture.valid,
      releases: ['0.0.x']
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        '0.0.2': {
          date: new Date('2012-12-21'),
          sections: {
            'Added': [
              'Add feature 4',
              'Add feature 5'
            ],
            'Changed': [
              'Change feature 2'
            ],

            'Fixed': [
              'Fix feature 3'
            ],

            'Security': [
              'Feature 1'
            ]
          }
        },
        '0.0.1': {
          date: new Date('1970-01-01'),
          sections: {
            'Added': [
              'Add feature 1',
              'Add feature 2',
              'Add feature 3'
            ]
          }
        }
      });

      done();
    });
  });

  it('should accept "all" as release option', function (done) {
    chlgShow({
      file: fixture.valid,
      releases: ['all']
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        'Unreleased': {
          date: null,
          sections: {
            'Added': [
              'Add feature 6',
              'Add feature 7',
              'Add feature 8'
            ],
            'Changed': [
              'Change feature 5'
            ],
            'Deprecated': [
              'Deprecate feature 1'
            ],
            'Removed': [
              'Remove feature 2'
            ],
            'Fixed': [
              'Fix feature 3',
              'Fix feature 4'
            ]
          }
        },
        '0.0.2': {
          date: new Date('2012-12-21'),
          sections: {
            'Added': [
              'Add feature 4',
              'Add feature 5'
            ],
            'Changed': [
              'Change feature 2'
            ],
            'Fixed': [
              'Fix feature 3'
            ],

            'Security': [
              'Feature 1'
            ]
          }
        },
        '0.0.1': {
          date: new Date('1970-01-01'),
          sections: {
            'Added': [
              'Add feature 1',
              'Add feature 2',
              'Add feature 3'
            ]
          }
        }
      });

      done();
    });
  });

  it('should accept "latest" as release option', function (done) {
    chlgShow({
      file: fixture.valid,
      releases: ['latest']
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        '0.0.2': {
          date: new Date('2012-12-21'),
          sections: {
            'Added': [
              'Add feature 4',
              'Add feature 5'
            ],
            'Changed': [
              'Change feature 2'
            ],

            'Fixed': [
              'Fix feature 3'
            ],

            'Security': [
              'Feature 1'
            ]
          }
        }
      });

      done();
    });
  });

  it('should filter releases with "from" option', function (done) {
    chlgShow({
      file:     fixture.valid,
      releases: ['all'],
      from:     '2000-01-01'
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        'Unreleased': {
          date: null,
          sections: {
            'Added': [
              'Add feature 6',
              'Add feature 7',
              'Add feature 8'
            ],
            'Changed': [
              'Change feature 5'
            ],
            'Deprecated': [
              'Deprecate feature 1'
            ],
            'Removed': [
              'Remove feature 2'
            ],
            'Fixed': [
              'Fix feature 3',
              'Fix feature 4'
            ]
          }
        },
        '0.0.2': {
          date: new Date('2012-12-21'),
          sections: {
            'Added': [
              'Add feature 4',
              'Add feature 5'
            ],
            'Changed': [
              'Change feature 2'
            ],

            'Fixed': [
              'Fix feature 3'
            ],

            'Security': [
              'Feature 1'
            ]
          }
        }
      });

      done();
    });
  });

  it('should filter releases with "to" option', function (done) {
    chlgShow({
      file:     fixture.valid,
      releases: ['all'],
      to:       '2000-01-01'
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        '0.0.1': {
          date: new Date('1970-01-01'),
          sections: {
            'Added': [
              'Add feature 1',
              'Add feature 2',
              'Add feature 3'
            ]
          }
        }
      });

      done();
    });
  });

  it('should filter releases with "from" and "to" option', function (done) {
    chlgShow({
      file:     fixture.valid,
      releases: ['all'],
      from:     '2000-01-01',
      to:       '2014-01-01'
    }, function (error, logs) {
      expect(error).to.not.exist;

      expect(logs).to.deep.equal({
        '0.0.2': {
          date: new Date('2012-12-21'),
          sections: {
            'Added': [
              'Add feature 4',
              'Add feature 5'
            ],
            'Changed': [
              'Change feature 2'
            ],

            'Fixed': [
              'Fix feature 3'
            ],

            'Security': [
              'Feature 1'
            ]
          }
        }
      });

      done();
    });
  });

  it('should return an error on bad release number', function (done) {
    chlgShow({
      file: fixture.valid,
      releases: ['Not a release']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('‘Not a release’ is not valid semver version/range');
      expect(logs).to.be.undefined;
      done();
    });
  });

  it('should return an error on bad section name', function (done) {
    chlgShow({
      file: fixture.valid,
      sections: ['Bad']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('‘bad’ is not valid changelog section');
      expect(logs).to.be.undefined;
      done();
    });
  });

  it('should return an error with no matching release found', function (done) {
    chlgShow({
      file: fixture.empty,
      releases: ['0.0.1']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('no matching release found');
      expect(logs).to.be.undefined;
      done();
    });
  });

  it('should return an error for "latest" with no releases in changelog', function (done) {
    chlgShow({
      file: fixture.empty,
      releases: ['latest']
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('no matching release found');
      expect(logs).to.be.undefined;
      done();
    });
  });

  it('should return an error for bad format on "from" parameter', function (done) {
    chlgShow({
      file: fixture.valid,
      from: 'Not a date'
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Date format must be YYYY-MM-DD');
      expect(logs).to.be.undefined;
      done();
    });
  });

  it('should return an error for bad format on "to" parameter', function (done) {
    chlgShow({
      file: fixture.valid,
      to:   'Not a date'
    }, function (error, logs) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Date format must be YYYY-MM-DD');
      expect(logs).to.be.undefined;
      done();
    });
  });

  after('Restore CWD', function () {
    process.chdir(cwd);
  });

});
