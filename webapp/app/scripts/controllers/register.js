'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('RegisterCtrl', function ($scope, $timeout, $location, $window, $http, toaster, Utils) {
	  
	  $scope.user = {}; // {username: "Tiziano", email: "tiziano.flati@gmail.com", first_name:"Tiziano", last_name: "Flati", affiliation:"CINECA", password: "arc0bal3n0", repassword: "arc0bal3n0"};
	  
	  $scope.send = function(){
		  
		  var register_api = Utils.REST_API + "user/register/";
	      console.log("SEARCH", register_api, $scope.user);
		  
		  $http.post(register_api, $scope.user)
	  		.then(function(response){
					console.log(response);
					
					if(response.data.type == "message"){
						$scope.registration_successful = true;
						
						$window.scrollTo(0, 0);
						$timeout(function(){$location.path("/");}, 3000);
					}
					
					toaster.pop({
			            type: response.data.type,
			            title: "Server " + response.data.type,
			            body: response.data.content,
			            timeout: 3000
			        });
	  		})
	  		.catch(function(response){
//				if (response.status == "-1")
					toaster.pop({
			            type: "error",
			            title: "Server error",
			            body: "There was an error during registration. Please, try again.",
			            timeout: 3000
			        });
				console.log("ERROR", response);
			})
			.finally(function(){
			});
	  };
  });
