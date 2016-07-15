'use strict';

var expect     = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon      = require('sinon');

var spy = sinon.spy();

var chlgRemove = proxyquire('../../lib/chlg-remove', {
  './chlg-insert': spy,
  './common/sections.js': {
    REMOVED: 'Removed'
  }
});

describe('chlg-remove', function () {

  it('should call chlgInsert with \'Removed\' as section', function () {
    var message  = 'Hello, friend.';
    var filename = 'CHANGELOG.md';
    var callback = function () {};

    chlgRemove(message, filename, callback);

    expect(spy.calledWithExactly('Removed', message, filename, callback)).to.equal(true);
  });

});
