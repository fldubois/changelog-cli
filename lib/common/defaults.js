'use strict';

var releases = require('./releases');

module.exports = {
  file:     'CHANGELOG.md',
  releases: [releases.UNRELEASED],
  sections: ['all']
};
