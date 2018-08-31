angular.module('sraSearchApp').filter('expFilterApplier', function () {
  return function (input, filters) {
	  if (input == undefined) return input;
	  
	  var original = input;
	  
	  for(var i in filters){
		  var filterGroup = filters[i];
		  var filtered = [];
		  
		  for(var o in original){
			  var experiment = original[o];
			  
			  for(var j in filterGroup.values){
				  var filter = filterGroup.values[j];
				  var accept = filter.eval(experiment, filter);
				  if (filter.selected && accept){
					  filtered.push(experiment);
					  break;
				  }
			  }
		  }
		  
		  original = filtered;
	  }
	  
	  return original;
  };
});