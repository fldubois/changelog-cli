'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

var spy = sinon.spy();

var chlgFix = proxyquire('../../lib/chlg-fix', {
  './chlg-insert': spy,
  './common/sections.js': {
    FIXED: 'Fixed'
  }
});

describe('chlg-fix', function () {

  it('should bind chlgInsert with \'Fixed\' as section', function () {
    var message  = 'Hello, friend.';
    var filename = 'CHANGELOG.md';
    var callback = function () {};

    chlgFix(message, filename, callback);

    expect(spy.calledWithExactly('Fixed', message, filename, callback)).to.equal(true);
  });

});
