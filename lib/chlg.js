'use strict';

module.exports = {
  init:      require('./chlg-init'),
  release:   require('./chlg-release'),
  show:      require('./chlg-show'),
  insert:    require('./chlg-insert'),
  add:       require('./chlg-add'),
  change:    require('./chlg-change'),
  deprecate: require('./chlg-deprecate'),
  remove:    require('./chlg-remove'),
  fix:       require('./chlg-fix'),
  security:  require('./chlg-security')
};
