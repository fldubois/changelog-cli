'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

var spy = sinon.spy();

var chlgDeprecate = proxyquire('../../lib/chlg-deprecate', {
  './chlg-insert': spy,
  './common/sections.js': {
    DEPRECATED: 'Deprecated'
  }
});

describe('chlg-deprecate', function () {

  it('should call chlgInsert with \'Deprecated\' as section', function () {
    var message  = 'Hello, friend.';
    var filename = 'CHANGELOG.md';
    var callback = function () {};

    chlgDeprecate(message, filename, callback);

    expect(spy.calledWithExactly('Deprecated', message, filename, callback)).to.equal(true);
  });

});
