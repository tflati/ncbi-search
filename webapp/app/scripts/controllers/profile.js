'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('ProfileCtrl', function ($scope, userService, $http, $location, toaster, moment, Utils) {
	  
	  $scope.user = userService;
	  $scope.projects = [];
	  
	  var profile_api = Utils.REST_API + "user/get_projects/" + $scope.user.username;
      console.log("PROFILE", profile_api, $scope.user);
      
	  $http.get(profile_api)
		.then(function(response){
				$scope.loaded = true;
				
				console.log(response, response.header);
				angular.forEach(response.data, function(project){
					
					delete project.fields.base_path
					
					project.fields.creation_date = {
							value: moment(project.fields.creation_date).fromNow(),
							title: "Exact date: " + project.fields.creation_date
					};
					
					project.fields.creator = {
						value: project.fields.creator.name + " " + project.fields.creator.surname,
						title: "(username: "+project.fields.creator.username+")"
					};
					
					console.log(project.fields);
					
					$scope.projects.push(project.fields);
				});
		})
		.catch(function(response){
			toaster.pop({
		            type: "error",
		            title: "Server error",
		            body: "There was an error during project retrieval. Please, try again.",
		            timeout: 3000
		        });
			console.log("ERROR", response);
		})
		.finally(function(){
		});
  });
