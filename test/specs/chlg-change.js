'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

var spy = sinon.spy();

var chlgChange = proxyquire('../../lib/chlg-change', {
  './chlg-insert': spy,
  './common/sections.js': {
    CHANGED: 'Changed'
  }
});

describe('chlg-change', function () {

  it('should bind chlgInsert with \'Changed\' as section', function () {
    var message  = 'Hello, friend.';
    var filename = 'CHANGELOG.md';
    var callback = function () {};

    chlgChange(message, filename, callback);

    expect(spy.calledWithExactly('Changed', message, filename, callback)).to.equal(true);
  });

});
