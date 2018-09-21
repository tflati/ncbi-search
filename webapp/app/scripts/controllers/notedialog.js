'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:NotedialogCtrl
 * @description
 * # NotedialogCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('NoteDialogCtrl', function ($scope, $mdDialog, data) {
    $scope.note = data;
    
    $scope.close = function(){$mdDialog.cancel();}
    $scope.save = function(){$mdDialog.hide($scope.note);}
    $scope.cancel = function(){$mdDialog.cancel();}
  });
