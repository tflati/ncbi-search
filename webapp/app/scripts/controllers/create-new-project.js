'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:CreateNewProjectCtrl
 * @description
 * # CreateNewProjectCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('CreateNewProjectCtrl', function ($scope, userService, $http, $location, toaster, Utils) {
    
    $scope.user = userService;
    
    $scope.project = {
    		username: $scope.user.username,
    		title: "My First Project"
    };
    
    $scope.send = function(){
		  
		  var login_api = Utils.REST_API + "user/create_new_project/";
	      console.log("LOGIN", login_api, $scope.user);
		  
		  $http.post(login_api, $scope.project)
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
