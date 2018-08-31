angular.module('sraSearchApp').filter('lengths', function () {
  return function (input) {
	  if (input == undefined) return input;
	  var transformed = [];
      for(var i=0; i<input.length; i++)
    	  transformed.push(input[i].length);
      return transformed;
  };
});