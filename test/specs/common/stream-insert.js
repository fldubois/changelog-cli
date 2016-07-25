'use strict';

var expect = require('chai').expect;

var PassThrough = require('stream').PassThrough;

var StreamInsert = require('../../../lib/common/stream-insert');

function insert(lines, stream, callback) {
  var input  = new PassThrough();
  var output = input.pipe(stream);
  var result = '';

  output.on('readable', function () {
    var line = output.read();

    while (line) {
      result += line.toString();
      line = output.read();
    }
  });

  output.on('end', function () {
    callback(null, result);
  });

  output.on('error', function (error) {
    callback(error);
  });

  lines.forEach(function (line, index) {
    input.write(line + ((index < lines.length - 1) ? '\n' : ''));
  });

  input.end();
}

describe('common/stream-insert', function () {

  it('should always create a StreamInsert instance', function () {
    expect(StreamInsert.apply({})).to.be.an.instanceof(StreamInsert);
  });

  it('should append the insertion after search', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert('Appended line', /^Line 2$/), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Line 2',
        'Appended line',
        'Line 3'
      ]);

      return done();
    });
  });

  it('should prepend the insertion after search', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert('Appended line', /^Line 2$/, true), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Appended line',
        'Line 2',
        'Line 3'
      ]);

      return done();
    });
  });

  it('should append multiple lines', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert(['Appended line 1', 'Appended line 2'], /^Line 2$/), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Line 2',
        'Appended line 1',
        'Appended line 2',
        'Line 3'
      ]);

      return done();
    });
  });

  it('should append the insertion after each search', function (done) {
    var lines = [
      'Line A',
      'Line searched',
      'Line B',
      'Line searched',
      'Line C'
    ];

    insert(lines, new StreamInsert('Appended line', /^Line searched$/), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line A',
        'Line searched',
        'Appended line',
        'Line B',
        'Line searched',
        'Appended line',
        'Line C'
      ]);

      return done();
    });
  });

  it('should append the insertion all searches matched', function (done) {
    var lines = [
      'Line A',
      'Line searched 1',
      'Line searched 2',
      'Line B',
      'Line searched 1',
      'Line C',
      'Line searched 1',
      'Line searched 2',
      'Line D',
      'Line searched 2',
      'Line C'
    ];

    insert(lines, new StreamInsert('Appended line', [
      /^Line searched 1$/,
      /^Line searched 2$/
    ]), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line A',
        'Line searched 1',
        'Line searched 2',
        'Appended line',
        'Line B',
        'Line searched 1',
        'Line C',
        'Line searched 1',
        'Line searched 2',
        'Appended line',
        'Line D',
        'Line searched 2',
        'Line C'
      ]);

      return done();
    });
  });

  it('should append the insertion when search matches the last line', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert('Appended line', /^Line 3$/), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Line 2',
        'Line 3',
        'Appended line'
      ]);

      return done();
    });
  });

  it('should prepend the insertion when search matches the last line', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert('Appended line', /^Line 3$/, true), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Line 2',
        'Appended line',
        'Line 3'
      ]);

      return done();
    });
  });

  it('should append the insertion at the end of file', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert('Appended line', /\x03/, true), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Line 2',
        'Line 3',
        'Appended line'
      ]);

      return done();
    });
  });

  it('should not append the insertion after last line with remaining searches', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert('Appended line', [
      /^Line 3$/,
      /foo/
    ]), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Line 2',
        'Line 3'
      ]);

      return done();
    });
  });

  it('should not append the insertion at the end of file with remaining searches', function (done) {
    var lines = [
      'Line 1',
      'Line 2',
      'Line 3'
    ];

    insert(lines, new StreamInsert('Appended line', [
      /\x03/,
      /foo/
    ]), function (error, result) {
      if (error) {
        return done(error);
      }

      expect(result.split('\n')).to.deep.equal([
        'Line 1',
        'Line 2',
        'Line 3'
      ]);

      return done();
    });
  });

});
