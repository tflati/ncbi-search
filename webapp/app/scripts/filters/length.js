angular.module('sraSearchApp').filter('length', function () {
  return function (input) {
	  if (input == undefined) return input;
      return input.length || 0;
  };
});