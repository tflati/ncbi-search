'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:SearchctrlCtrl
 * @description
 * # SearchctrlCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp').controller('SearchCtrl', function ($scope, $http, Utils) {
	
	$scope.database = "sra";
	$scope.search_query_text = "PRJNA462667"; //"PRJNA462667", "PRJNA398031" (multispecies)
	$scope.max_results = 100000;
	$scope.Utils = Utils;
    
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
    	if($scope.sortType == "organisms") return row.experiments.reduce((n, exp) => {n.push(exp.Pool.Member.organism); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	if($scope.sortType == "number_experiments") return row.experiments.length;
    	if($scope.sortType == "number_runs") return row.experiments.reduce((n, exp) => n + $scope.get_runs(exp).length, 0);
    	if($scope.sortType == "library_sources") return row.experiments.reduce((n, exp) => {n.push($scope.get_library_source(exp)); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	if($scope.sortType == "library_layouts") return row.experiments.reduce((n, exp) => {n.concat($scope.get_layouts(exp)); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	if($scope.sortType == "platform") return row.experiments.reduce((n, exp) => {n.push($scope.get_platform(exp)); return n}, []).filter((x,i,arr) => arr.indexOf(x) === i).join(',');
    	return row.id;
    };
    
    $scope.add_filter = function(x, type, filterFunction){
    	// Organism filter
		var group = $scope.filters.filter(o => {return o.type === type});
		if (group.length == 0) {
			var groupObject = {type: type, values: []};
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
	    		$scope.add_filter(data.EXPERIMENT.PLATFORM[Object.keys(data.EXPERIMENT.PLATFORM)[0]].INSTRUMENT_MODEL["$t"], "PLATFORM", function(o, x){
	    			return o.EXPERIMENT.PLATFORM[Object.keys(o.EXPERIMENT.PLATFORM)[0]].INSTRUMENT_MODEL["$t"] == x.value;
	        		});
	    		
	    		// Layout filter
	    		$scope.add_filter(Object.keys(data.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_LAYOUT)[0], "LIBRARY LAYOUT", function(o, x){
	    			return Object.keys(o.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_LAYOUT)[0] == x.value;
	        		});
	    		
	    		// Layout source
	    		$scope.add_filter(data.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SOURCE["$t"], "LIBRARY SOURCE", function(o, x){
	    			return o.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SOURCE["$t"] == x.value;
	        		});
	    		
	    		// Paper filter
	    		$scope.add_filter(data.STUDY.STUDY_LINKS != undefined &&
	    				data.STUDY.STUDY_LINKS.STUDY_LINK != undefined &&
	    				data.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK != undefined &&
	    				data.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK.ID["$t"] != undefined ? "WITH PAPER" : "WITHOUT PAPER", "PUBLICATION", function(o, x){
		    				var value = o.STUDY.STUDY_LINKS != undefined &&
			    				o.STUDY.STUDY_LINKS.STUDY_LINK != undefined &&
			    				o.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK != undefined &&
			    				o.STUDY.STUDY_LINKS.STUDY_LINK.XREF_LINK.ID["$t"] != undefined ? "WITH PAPER" : "WITHOUT PAPER";
		    				return value == x.value;
	        		});   
	    		
	    		// Organism filter
	    		if(data.Pool == undefined || data.Pool.Member == undefined || data.Pool.Member.organism == undefined)
	    			console.log("MISSING ORGANISM?", data);
	    		
	    		$scope.add_filter(data.Pool.Member.organism, "ORGANISM", function(o, x){
	    			return o.Pool.Member.organism == x.value;
	        		});
	    	}
    	}
    	
//    	console.log("CREATED FILTERS", $scope.filters);
    };
    
    $scope.get_runs = function(x){return angular.isArray(x.RUN_SET.RUN) ? x.RUN_SET.RUN : [x.RUN_SET.RUN];};
    $scope.get_layouts = function(x){return Object.keys(x.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_LAYOUT);};
    $scope.get_library_source = function(x){return x.EXPERIMENT.DESIGN.LIBRARY_DESCRIPTOR.LIBRARY_SOURCE["$t"];};
    $scope.get_platform = function(x){return x.EXPERIMENT.PLATFORM[Object.keys(x.EXPERIMENT.PLATFORM)[0]].INSTRUMENT_MODEL["$t"];};
    $scope.get_organism = function(x){return x.Pool.Member.organism;};
    $scope.get_experiments = function(x){return x.experiments;};
    
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
			})
			.catch(function(response){
				console.log("ERROR", response);
			})
			.finally(function(){
				$scope.search_started = false;
				$scope.search_finished = true;
			});
    };
  });
