angular.module('sraSearchApp').filter('apply', function () {
  return function (input,fx) {
	  if (input == undefined) return input;
      var transformed = [];
      for(var i=0; i<input.length; i++)
    	  transformed.push(fx(input[i]));
      return transformed;
  };
});