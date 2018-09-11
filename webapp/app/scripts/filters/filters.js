angular.module('sraSearchApp').filter('filterApplier', function () {
  return function (input, filters) {
	  if (input == undefined) return input;
	  
	  var original = input;
	  
	  for(var i in filters){
		  var filterGroup = filters[i];
		  var filtered = [];
		  
		  for(var o in original){
			  var bioproject = original[o];
			  
			  var filtered_bioproject = {id: bioproject.id, experiments: []};
			  
			  for(var k in bioproject.experiments){
				  var experiment = bioproject.experiments[k];
				  
				  for(var j in filterGroup.values){
					  var filter = filterGroup.values[j];
					  var accept = filter.eval(experiment, filter, filterGroup.type);
//					  console.log("\t\tFILTER GROUP", filterGroup.type, filter.value, bioproject.id, experiment, accept);
					  if (filter.selected && accept){
						  filtered_bioproject.experiments.push(experiment);
						  break;
					  }
				  }
			  }
			  
			  if(filtered_bioproject.experiments.length > 0)
				  filtered.push(bioproject);
			  
//			  console.log("\t\tFILTER GROUP", filterGroup.type, filterGroup, filtered_bioproject);
		  }
		  
		  original = filtered;
	  }
	  
	  return original;
  };
});