angular.module('sraSearchApp').filter('sum', function () {
  return function (input) {
	  if (input == undefined) return input;
      // return input.reduce((a, b) => a + b, 0);
	  var total = 0;
	  angular.forEach(input, function(x){
		  if(x==undefined) return;
		  total += x;
	  });
	  
	  return total;
  };
});