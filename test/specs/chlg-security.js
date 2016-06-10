'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

var spy = sinon.spy();

var chlgSecurity = proxyquire('../../lib/chlg-security', {
  './chlg-insert': spy,
  './common/sections.js': {
    SECURITY: 'Security'
  }
});

describe('chlg-security', function () {

  it('should bind chlgInsert with \'Security\' as section', function () {
    var message  = 'Hello, friend.';
    var filename = 'CHANGELOG.md';
    var callback = function () {};

    chlgSecurity(message, filename, callback);

    expect(spy.calledWithExactly('Security', message, filename, callback)).to.equal(true);
  });

});
