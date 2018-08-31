'use strict';

describe('Controller: SearchctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('sraSearchApp'));

  var SearchctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchctrlCtrl = $controller('SearchctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SearchctrlCtrl.awesomeThings.length).toBe(3);
  });
});
