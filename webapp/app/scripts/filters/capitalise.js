'use strict';

/**
 * @ngdoc filter
 * @name sraSearchApp.filter:capitalise
 * @function
 * @description
 * # capitalise
 * Filter in the sraSearchApp.
 */
angular.module('sraSearchApp')
  .filter('capitalise', function () {
    return function (input) {
    	//return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    	return input.charAt(0).toUpperCase();
    };
  });
