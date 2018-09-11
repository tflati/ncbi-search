'use strict';

/**
 * @ngdoc service
 * @name sraSearchApp.user
 * @description
 * # user
 * Service in the sraSearchApp.
 */
angular.module('sraSearchApp').service('userService', function ($cookies, $location, $http, toaster) {
	
	var thisService = this;
	    
	    this.username = $cookies.get('username');
	    this.loggedIn = $cookies.get('logged_in') || false;
	    this.loginToken = $cookies.get('login_token');
	    
	    this.login = function(){
	    	thisService.update();
	    };
	    
	    this.update = function(){
	    	this.username = $cookies.get('username');
	    	this.loggedIn = $cookies.get('logged_in');
	    	this.loginToken = $cookies.get('login_token');
	    };
	    
	    this.logout = function(){
	    	var logout_api = "http://localhost/sra_django_api/user/logout/";
		      console.log("LOGOUT", logout_api, this.username);
			  
			  $http.get(logout_api)
		  		.then(function(response){
						console.log(response);
						thisService.update();
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
