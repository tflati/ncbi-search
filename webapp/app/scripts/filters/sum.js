angular.module('sraSearchApp').filter('sum', function () {
  return function (input) {
	  if (input == undefined) return input;
      return input.reduce((a, b) => a + b, 0);
  };
});