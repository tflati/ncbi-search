'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('TableDialogController', function ($scope, $mdDialog, data) {
	  $scope.table = data;
	  
	  $scope.cancel = function(){$mdDialog.cancel();}
  });
