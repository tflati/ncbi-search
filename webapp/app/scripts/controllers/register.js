'use strict';

/**
 * @ngdoc function
 * @name sraSearchApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the sraSearchApp
 */
angular.module('sraSearchApp')
  .controller('RegisterCtrl', function ($scope, $http, toaster) {
	  
	  $scope.user = {username: "Tiziano", email: "tiziano.flati@gmail.com", first_name:"Tiziano", last_name: "Flati", affiliation:"CINECA", password: "arc0bal3n0", repassword: "arc0bal3n0"};
	  
	  $scope.send = function(){
		  
		  var register_api = "http://localhost/sra_django_api/user/register/";
	      console.log("SEARCH", register_api, $scope.user);
		  
		  $http.post(register_api, $scope.user)
	  		.then(function(response){
					console.log(response);
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
