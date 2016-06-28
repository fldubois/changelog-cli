'use strict';

var chlgInsert = require('./chlg-insert');
var sections   = require('./common/sections.js');

module.exports = chlgInsert.bind(null, sections.SECURITY);
