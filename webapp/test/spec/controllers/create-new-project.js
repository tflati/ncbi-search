'use strict';

describe('Controller: CreateNewProjectCtrl', function () {

  // load the controller's module
  beforeEach(module('sraSearchApp'));

  var CreateNewProjectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateNewProjectCtrl = $controller('CreateNewProjectCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CreateNewProjectCtrl.awesomeThings.length).toBe(3);
  });
});
