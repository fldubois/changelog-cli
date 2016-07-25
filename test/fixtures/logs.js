'use strict';

module.exports = {
  'Unreleased': {
    date: null,
    sections: {
      Added: [
        'Add feature 6',
        'Add feature 7',
        'Add feature 8'
      ],
      Changed: [
        'Change feature 5'
      ],
      Deprecated: [
        'Deprecate feature 1'
      ],
      Removed: [
        'Remove feature 2'
      ],
      Fixed: [
        'Fix feature 3',
        'Fix feature 4'
      ]
    }
  },
  '0.0.2': {
    date: new Date('2012-12-21'),
    sections: {
      Added: [
        'Add feature 4',
        'Add feature 5'
      ],
      Changed: [
        'Change feature 2'
      ],
      Fixed: [
        'Fix feature 3'
      ],

      Security: [
        'Feature 1'
      ]
    }
  },
  '0.0.1': {
    date: new Date('1970-01-01'),
    sections: {
      Added: [
        'Add feature 1',
        'Add feature 2',
        'Add feature 3'
      ]
    }
  }
};
