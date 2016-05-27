'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

var spy = sinon.spy();

var chlgAdd = proxyquire('../../lib/chlg-add', {
  './chlg-insert': spy,
  './common/sections.js': {
    ADDED: 'Added'
  }
});

describe('chlg-add', function () {

  it('should bind chlgInsert with \'Added\' as section', function () {
    var message  = 'Hello, friend.';
    var filename = 'CHANGELOG.md';
    var callback = function () {};

    chlgAdd(message, filename, callback);

    expect(spy.calledWithExactly('Added', message, filename, callback)).to.equal(true);
  });

});
