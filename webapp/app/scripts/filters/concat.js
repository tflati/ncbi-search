angular.module('sraSearchApp').filter('concat', function () {
  return function (input) {
	  if (input == undefined) return input;
	  return input.reduce((a, b) => a.concat(b), []);
  };
});