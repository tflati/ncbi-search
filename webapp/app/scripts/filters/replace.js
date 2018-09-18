'use strict';

/**
 * @ngdoc filter
 * @name sraSearchApp.filter:replace
 * @function
 * @description
 * # replace
 * Filter in the sraSearchApp.
 */
angular.module('sraSearchApp')
  .filter('replace', function () {
    return function (input, from, to) {
      return input.replace(new RegExp(from, 'g'), to);
    };
  });
