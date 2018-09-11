'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:SearchctrlCtrl
 * @description
 * # SearchctrlCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp').controller('SearchCtrl', function ($scope, $http, Utils, toaster, $filter, $mdDialog, userService) {
	
	$scope.database = "sra";
	$scope.search_query_text = "PRJNA398031"; //"PRJNA462667", "PRJNA398031" (multispecies)
	$scope.max_results = 100000;
	$scope.Utils = Utils;
	$scope.user = userService;
	$scope.filter = $filter('expFilterApplier');
    
	$scope.update_charts = function(){

		// For each filter category
		angular.forEach($scope.filters, function(filter){
			var filtered = [];
	    	angular.forEach($scope.result, function(bioproject){
	    		filtered = filtered.concat($scope.get_experiments(bioproject));
	    	});
	    	var filtered = $scope.filter(filtered, $scope.filters);
	    	
	    	// For each filter value
	    	var counter = {};
			angular.forEach(filter.values, function(f){
				angular.forEach(filtered, function(experiment){
					if (f.eval(experiment, f, filter.type)) {
						if(!(f.value in counter)) counter[f.value] = 0;
						counter[f.value] += 1;
					}
	    		});
			});
			
			var values = [];
			var keys = Object.keys(counter);
			keys.sort();
			angular.forEach(keys, function(key){
				var value = counter[key];
				values.push(value);
			});
			
			filter.data = values;
			filter.labels = keys;
		});
	};
	
	$scope.see_chart = function(filter) {
		
		console.log("Showing chart of filter", filter.type, filter);
		
	    $mdDialog.show({
	      locals:{data: filter},
	      controller: "ChartDialogController",
	      templateUrl: 'views/chart.html',
	      clickOutsideToClose:true
	    })
	    .then(function(answer) {
	    }, function() {
	    });
	    
	    console.log("Shown chart of filter", filter.type, filter);
	  };
	  
	  $scope.see_table = function(bioproject, ev) {
		  
		  var table = {title: bioproject.id, header: [], rows: []};
		  table.header.push("ids");
		  angular.forEach(bioproject.experiments, function(data){
			  if(data.SAMPLE.SAMPLE_ATTRIBUTES){
				  var row = [];
				  row.push(data.EXPERIMENT.accession);
				  
		    		angular.forEach(data.SAMPLE.SAMPLE_ATTRIBUTES.SAMPLE_ATTRIBUTE, function(attribute, index){
		    			var key = attribute.TAG["$t"];
		    			var value = attribute.VALUE["$t"];
		    			
		    			if(!table.header.includes(key)) table.header.push(key);
		    			row.push(value);
		    		});
		    	  table.rows.push(row);
			  }
		  });
		  
		  console.log("PHENOTIPIC TABLE", table);
		  
		    $mdDialog.show({
		      locals:{data: table},    
		      controller: "TableDialogController",
		      templateUrl: 'views/table.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: true
		    })
		    .then(function(answer) {
		    }, function() {
		    });
		  };
	
	$scope.databases = [
		{
			id: "bioproject",
			name: "BioProject"
		},
		{
			id: "biosample",
			name: "BioSample"
		},
		{
			id: "biosystems",
			name: "Biosystems"
		},
		{
			id: "books",
			name: "Books"
		},
		{
			id: "cdd",
			name: "Conserved Domains"
		},
		{
			id: "gap",
			name: "dbGaP"
		},
		{
			id: "dbvar",
			name: "dbVar"
		},
		{
			id: "epigenomics",
			name: "Epigenomics"
		},
		{
			id: "nucest",
			name: "EST"
		},
		{
			id: "gene",
			name: "Gene"
		},
		{
			id: "genome",
			name: "Genome"
		},
		{
			id: "gds",
			name: "GEO Datasets"
		},
		{
			id: "geoprofiles",
			name: "GEO Profiles"
		},
		{
			id: "nucgss",
			name: "GSS"
		},
		{
			id: "homologene",
			name: "HomoloGene"
		},
		{
			id: "mesh",
			name: "MeSH"
		},
		{
			id: "toolkit",
			name: "NCBI C++ Toolkit"
		},
		{
			id: "ncbisearch",
			name: "NCBI Web Site"
		},
		{
			id: "nlmcatalog",
			name: "NLM Catalog"
		},
		{
			id: "nuccore",
			name: "Nucleotide"
		},
		{
			id: "omia",
			name: "OMIA"
		},
		{
			id: "popset",
			name: "PopSet"
		},
		{
			id: "probe",
			name: "Probe"
		},
		{
			id: "protein",
			name: "Protein"
		},
		{
			id: "proteinclusters",
			name: "Protein Clusters"
		},
		{
			id: "pcassay",
			name: "PubChem BioAssay"
		},
		{
			id: "pccompound",
			name: "PubChem Compound"
		},
		{
			id: "pcsubstance",
			name: "PubChem Substance"
		},
		{
			id: "pubmed",
			name: "PubMed"
		},
		{
			id: "pmc",
			name: "PubMed Central"
		},
		{
			id: "snp",
			name: "SNP"
		},
		{
			id: "sra",
			name: "SRA"
		},
		{
			id: "structure",
			name: "Structure"
		},
		{
			id: "taxonomy",
			name: "Taxonomy"
		},
		{
			id: "unigene",
			name: "UniGene"
		},
		{
			id: "unists",
			name: "UniSTS"
		}
	];
    
    $scope.result = undefined;
    $scope.search_started = false;
    $scope.search_finished = false;
    $scope.filters = [];
    $scope.sortType = "id";
    $scope.sortReverse = false;
    
    $scope.sortTable = function(x){
    	if ($scope.sortType == x) $scope.sortReverse = !$scope.sortReverse;
    	$scope.sortType = x;
    };
    
    $scope.sortFx = function(row){
    	if($scope.sortType == "id") return row.id;
    	if($scope.sortType == "paper_id") return row.paper_id;
    	if($scope.sortType == "organisms") return row.experiments.reduce((n, exp) => {n.push($scope.get_organism(exp)); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	if($scope.sortType == "number_experiments") return row.experiments.length;
    	if($scope.sortType == "number_runs") return row.experiments.reduce((n, exp) => n + $scope.get_runs(exp).length, 0);
    	if($scope.sortType == "library_sources") return row.experiments.reduce((n, exp) => {n.push($scope.get_library_source(exp)); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	if($scope.sortType == "library_layouts") return row.experiments.reduce((n, exp) => {n.concat($scope.get_layouts(exp)); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	if($scope.sortType == "platform") return row.experiments.reduce((n, exp) => {n.push($scope.get_platform(exp)); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	return row.id;
    };
    
    $scope.add_filter = function(x, type, filterFunction, label){
    	
    	if(label == undefined)
    		label = type;
    	
    	// Organism filter
		var group = $scope.filters.filter(o => {return o.type === type});
		if (group.length == 0) {
			var groupObject = {label: label, selected: true, type: type, values: []};
			$scope.filters.push(groupObject);
			group = [groupObject];
		}
		var newFilterValue = {value: x, count: 0, selected: true, eval: filterFunction};
		
		var filterObject = group[0].values.filter(o => {return o.value == x});
		if (filterObject.length == 0){
			group[0].values.push(newFilterValue);
			filterObject = [newFilterValue];
		}
		filterObject[0].count += 1
    };
    
    $scope.shown_projects = [];
    $scope.goToPage = function(message, objects, page, pageSize, total){
    	console.log("GO TO PAGE", message, objects, page, pageSize, total);
    	$scope.shown_projects = objects.slice(pageSize*(page-1), pageSize*page);
    };
    
    $scope.make_filters = function(){
    	
    	for(var k in $scope.result){
    		var bioproject = $scope.result[k];
    		
	    	for(var i in bioproject.experiments){
	    		var data = bioproject.experiments[i];
	    		
	    		// Platform filter
	    		$scope.add_filter(data.EXPERIMENT.PLATFORM[Object.keys(data.EXPERIMENT.PLATFORM)[0]].INSTRUMENT_MODEL["$t"], "PLATFORM", function(o, x, type){
	    			return $scope.get_platform(o) == x.value;
	        		});
	    		
	    		// Layout filter
	    		$scope.add_filter(Object.keys(data.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_LAYOUT)[0], "LIBRARY LAYOUT", function(o, x, type){
	    			return $scope.get_layouts(o)[0] == x.value;
	        		});
	    		
	    		// Layout source
	    		$scope.add_filter(data.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SOURCE["$t"], "LIBRARY SOURCE", function(o, x, type){
	    			return $scope.get_library_source(o) == x.value;
	        		});
	    		
	    		// Paper filter
	    		$scope.add_filter($scope.get_paper(data) != undefined ? "WITH PAPER" : "WITHOUT PAPER", "PUBLICATION", function(o, x, type){
		    				var value = $scope.get_paper(o) != undefined ? "WITH PAPER" : "WITHOUT PAPER";
		    				return value == x.value;
	        		});   
	    		
	    		// Organism filter
	    		$scope.add_filter($scope.get_organism(data), "ORGANISM", function(o, x, type){
	    			var organism = $scope.get_organism(o);
	    			if (organism == undefined) return true;
	    			return organism == x.value;
	        		});
	    		
	    		// Phenodata filter(s)
	    		if(data.SAMPLE.SAMPLE_ATTRIBUTES){
		    		angular.forEach(data.SAMPLE.SAMPLE_ATTRIBUTES.SAMPLE_ATTRIBUTE, function(attribute, index){
		    			$scope.add_filter(attribute.VALUE["$t"], attribute.TAG["$t"], function(o, x, type){
		    				var v = $scope.get_attribute(o, type);
		    				if (v == undefined) return true;
		    				return v == x.value;
			        		}, "SAMPLE ATTRIBUTE: " + attribute.TAG["$t"]);
		    		});
	    		}
	    	}
    	}
    	
//    	console.log("CREATED FILTERS", $scope.filters);
    };
    
    $scope.clear_filters = function(){
    	angular.forEach($scope.filters, function(filter){
    		angular.forEach(filter.values, function(f){
    			f.selected = true;
    		});
    	});
    };
    
    $scope.toggle_all = function(filter){
		angular.forEach(filter.values, function(f){
			f.selected = filter.selected;
		});
    };
    
    $scope.update_filters = function(selected){
    	
    	var filtered = [];
//    	console.log("Getting all experiments");
    	angular.forEach($scope.result, function(bioproject){
    		filtered = filtered.concat($scope.get_experiments(bioproject));
    	});
    	var filtered = $scope.filter(filtered, $scope.filters);
//    	console.log("|FILTERED|", filtered.length);
    	
    	// For each filter category
    	angular.forEach($scope.filters, function(filter){
//    		console.log("\tUPDATING FILTER", filter.type);
    		
	    	// For each filter value
    		angular.forEach(filter.values, function(f){
    			var exp_applicable = 0;
    			
    	    	// For each experiment
    			angular.forEach(filtered, function(experiment){
					if (f.eval(experiment, f, filter.type)) exp_applicable += 1;
        		});

    			if(!selected && exp_applicable == 0) f.selected = false;
    		});
    	});
    };
    
    $scope.get_runs = function(x){return angular.isArray(x.RUN_SET.RUN) ? x.RUN_SET.RUN : [x.RUN_SET.RUN];};
    $scope.get_paper = function(x){if(x.STUDY.STUDY_LINKS != undefined &&
	    				x.STUDY.STUDY_LINKS.STUDY_LINK != undefined &&
	    				x.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK != undefined &&
	    				x.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK.ID != undefined)
    	return x.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK.ID["$t"];
    	return undefined;};
    $scope.get_layouts = function(x){return Object.keys(x.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_LAYOUT);};
    $scope.get_library_source = function(x){return x.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SOURCE["$t"];};
    $scope.get_platform = function(x){return x.EXPERIMENT.PLATFORM[Object.keys(x.EXPERIMENT.PLATFORM)[0]].INSTRUMENT_MODEL["$t"];};
    $scope.get_organism = function(x){return x.SAMPLE.SAMPLE_NAME.SCIENTIFIC_NAME["$t"];};
    $scope.get_experiments = function(x){return x.experiments;};
    $scope.get_attribute = function(x, type){
    	if(! x.SAMPLE.SAMPLE_ATTRIBUTES ) return undefined;
//    	if(type == "source_name")
//    		console.log(x, type);
    	
    	var filtered = x.SAMPLE.SAMPLE_ATTRIBUTES.SAMPLE_ATTRIBUTE.filter(o => {return o.TAG["$t"] == type;});
    	if(filtered.length == 0) return undefined;
    	
    	if(filtered.length > 0) filtered = filtered[0].VALUE["$t"];
    	return filtered;
    };
    
    $scope.filter_clicked = function(f, filter){
    	console.log("CLICKED FILTER", f, filter, f.selected);
    	$scope.update_filters(f.selected);
//    	$scope.update_charts();
    };
    
    this.search = function(){
    	
    	$scope.search_started = true;
    	$scope.search_finished = false;
    	$scope.filters = [];
    	
    	var parameters = [];
    	parameters.push("db="+$scope.database);
    	parameters.push("query="+$scope.search_query_text);
    	parameters.push("max_hits="+$scope.max_results);
    	
    	var search_api = "http://localhost/sra_django_api/search/" + parameters.join("&");
        console.log("SEARCH", search_api);
        
    	$http.get(search_api)
    		.then(function(response){
				console.log(response);
				
				$scope.result = [];
				for(var i=0; i<response.data.EXPERIMENT_PACKAGE_SET.EXPERIMENT_PACKAGE.length; i++){
					var experiment = response.data.EXPERIMENT_PACKAGE_SET.EXPERIMENT_PACKAGE[i];
					var links = experiment.STUDY.IDENTIFIERS.EXTERNAL_ID;
					if(!angular.isArray(links)) links = [links];
					for (var l=0; l<links.length; l++){
						var link = links[l];
						if(link.namespace == "BioProject"){
							var bioproject_id = link["$t"]
							
							var bioproject = $scope.result.filter(o => {return o.id === bioproject_id});
							if (bioproject.length == 0) {
								var bioprojectObject = {id: bioproject_id, experiments: []};
								$scope.result.push(bioprojectObject);
								bioproject = [bioprojectObject];
							}
							
							bioproject[0].experiments.push(experiment);
						}
					}
					if(experiment.STUDY.STUDY_LINKS != undefined && experiment.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK != undefined)
						if(experiment.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK.DB["$t"] == "pubmed")
							bioproject[0].paper_id = experiment.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK.ID["$t"];
				}
				
				console.log("RESULT", $scope.result);
				
				$scope.make_filters();
				$scope.update_charts();
			})
			.catch(function(response){
				if (response.status == "-1")
					toaster.pop({
			            type: "error",
			            title: "Server error",
			            body: "There was an error during result fetching. Please, try again.",
			            timeout: 3000
			        });
				console.log("ERROR", response);
			})
			.finally(function(){
				$scope.search_started = false;
				$scope.search_finished = true;
			});
    };
  });
