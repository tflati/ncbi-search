angular.module('sraSearchApp').filter('uniq', function () {
  return function (input) {
	  if (input == undefined) return input;
      return Array.from(new Set(input));
  };
});