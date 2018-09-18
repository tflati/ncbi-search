'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('LoginCtrl', function ($scope, $http, $window, toaster, userService, $location, $timeout) {
	  
	  $scope.userService = userService;
	  
	  $scope.user = {email: "tiziano.flati@gmail.com", password:"arc0bal3n0"};
	  
	  $scope.send = function(){
		  
		  var login_api = "http://localhost/sra_django_api/user/login/";
	      console.log("LOGIN", login_api, $scope.user);
		  
		  $http.post(login_api, $scope.user)
	  		.then(function(response){
					console.log(response, response.header);
					userService.login();
					
					$window.scrollTo(0, 0);
					$timeout(function(){$location.path("/profile");}, 3000);
	  		})
	  		.catch(function(response){
				toaster.pop({
			            type: "error",
			            title: "Server error",
			            body: "There was an error during login. Please, try again.",
			            timeout: 3000
			        });
				console.log("ERROR", response);
			})
			.finally(function(){
			});
	  };
  });
