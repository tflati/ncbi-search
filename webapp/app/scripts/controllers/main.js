'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('MainCtrl', function ($scope, userService) {
	  $scope.user = userService;
  });
