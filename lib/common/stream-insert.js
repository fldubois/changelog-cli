'use strict';

var util = require('util');

var Transform = require('stream').Transform;

/**
 * Transform stream which inserts lines into the crossing stream.
 *
 * <p>
 * The <code>StreamInsert</code> transform read the input stream line by line. It tries to match the searched regular
 * expressions one by one. When a line match with the last regexp, it inserts the desired lines into the stream. It can
 * insert lines before or after the last matched line depending on the <code>prepend</code> parameter.
 * </p>
 *
 * @example
 * // Input:
 * //   Line C
 * //   Line B
 * //   Line A
 * //   Line B
 * //   Line D
 *
 * fs.createReadStream('input.txt').pipe(new StreamInsert([
 *   'Line X',
 *   'Line Y'
 * ], [
 *   /^Line A$/,
 *   /^Line B$/,
 * ]));
 *
 * // Output:
 * //   Line C
 * //   Line B
 * //   Line A
 * //   Line B
 * //   Line X
 * //   Line Y
 * //   Line D
 *
 * @exports common/stream-insert
 * @class
 * @augments stream.Transform
 *
 * @param    {string[]}     insertions      - Lines to insert in the stream
 * @param    {RegExp[]}     searches        - Regular expressions used to detect where the lines will be inserted
 * @param    {boolean}      [prepend=false] - Insert lines before the last line that match searches, after otherwise.
 *                                            Default to false.
 * @return   {StreamInsert} The StreamInsert instance
 */
var StreamInsert = module.exports = function (insertions, searches, prepend) {
  if (!(this instanceof StreamInsert)) {
    return new StreamInsert(insertions, searches, prepend);
  }

  Transform.call(this);

  this.insertions = Array.isArray(insertions) ? insertions : [insertions];
  this.searches   = Array.isArray(searches) ? searches : [searches];
  this.current    = 0;
  this.prepend    = prepend || false;
  this.cache      = '';
};

util.inherits(StreamInsert, Transform);

StreamInsert.prototype._transform = function (chunk, encoding, done) {
  var lines = (this.cache + chunk.toString()).split('\n');

  this.cache = lines.pop();

  lines.forEach(function (line) {
    var pushes = [line];

    if (this.searches[this.current].test(line)) {
      this.current = (this.current + 1) % this.searches.length;

      if (this.current === 0) {
        pushes[this.prepend ? 'unshift' : 'push'].apply(pushes, this.insertions);
      }
    }

    this.push(pushes.join('\n') + '\n');
  }, this);

  done();
};

StreamInsert.prototype._flush = function (done) {
  var lines = [this.cache];

  if (this.searches[this.current].test(this.cache)) {
    this.current = (this.current + 1) % this.searches.length;

    if (this.current === 0) {
      lines[this.prepend ? 'unshift' : 'push'].apply(lines, this.insertions);
    }
  } else if (this.searches[this.current].test('\u0003')) {
    this.current = (this.current + 1) % this.searches.length;

    if (this.current === 0) {
      lines.push.apply(lines, this.insertions);
    }
  }

  this.push(lines.join('\n'));

  done();
};
