'use strict';

describe('Controller: NotedialogCtrl', function () {

  // load the controller's module
  beforeEach(module('sraSearchApp'));

  var NotedialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NotedialogCtrl = $controller('NotedialogCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NotedialogCtrl.awesomeThings.length).toBe(3);
  });
});
