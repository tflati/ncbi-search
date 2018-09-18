'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('LogoutCtrl', function (userService, $timeout, $location) {
	  userService.logout();
	  
	  $timeout(function(){$location.path("/");}, 3000);
  });
