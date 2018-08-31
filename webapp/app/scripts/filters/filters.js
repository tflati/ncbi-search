angular.module('sraSearchApp').filter('filterApplier', function () {
  return function (input, filters) {
	  if (input == undefined) return input;
	  
	  var original = input;
//	  console.log("START", original, filters);
	  
	  for(var i in filters){
		  var filterGroup = filters[i];
		  var filtered = [];
		  
		  for(var o in original){
			  var bioproject = original[o];
//			  console.log("FILTER", filter, bioproject);
			  
			  var filtered_bioproject = {id: bioproject.id, experiments: []};
			  
			  for(var k in bioproject.experiments){
				  var experiment = bioproject.experiments[k];
				  
				  for(var j in filterGroup.values){
					  var filter = filterGroup.values[j];
					  var accept = filter.eval(experiment, filter);
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
//		  console.log("\tFILTER GROUP:", filterGroup, original);
//		  console.log("FILTER", filterGroup, original);
	  }
	  
//	  console.log("FILTER LAST", original);
		  
	  return original;
  };
});