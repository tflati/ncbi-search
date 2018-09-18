'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:DeleteProjectCtrl
 * @description
 * # DeleteProjectCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('DeleteProjectCtrl', function ($scope, $routeParams, userService, $http, $location, toaster) {
	  $scope.user = userService;
	  
	  $scope.projectId = $routeParams.projectId;
	  
	  $scope.send = function(){
		  
		  var delete_api = "http://localhost/sra_django_api/user/delete_project/";
	      console.log("LOGIN", delete_api, $scope.user);
		  
		  $http.post(delete_api, {username: $scope.user.username, project_id: $scope.projectId})
	  		.then(function(response){
					console.log(response, response.header);
					
					if(response.data.type)
						toaster.pop({
				            type: response.data.type,
				            title: "Server " + response.data.type,
				            body: response.data.content,
				            timeout: 3000
				        });
					
					if(response.data.type == "message")
						$location.path("/profile");
	  		})
	  		.catch(function(response){
				toaster.pop({
			            type: "error",
			            title: "Server error",
			            body: "There was an error during project creation. Please, try again.",
			            timeout: 3000
			        });
				console.log("ERROR", response);
			})
			.finally(function(){
			});
	  };
  });
