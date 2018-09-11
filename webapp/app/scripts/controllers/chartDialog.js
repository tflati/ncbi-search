'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('ChartDialogController', function ($scope, $mdDialog, data) {
	  $scope.filter = data;
	  
	  $scope.cancel = function(){$mdDialog.cancel();}
  });
