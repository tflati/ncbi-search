'use strict';

describe('Filter: byteFormatter', function () {

  // load the filter's module
  beforeEach(module('sraSearchApp'));

  // initialize a new instance of the filter before each test
  var byteFormatter;
  beforeEach(inject(function ($filter) {
    byteFormatter = $filter('byteFormatter');
  }));

  it('should return the input prefixed with "byteFormatter filter:"', function () {
    var text = 'angularjs';
    expect(byteFormatter(text)).toBe('byteFormatter filter: ' + text);
  });

});
