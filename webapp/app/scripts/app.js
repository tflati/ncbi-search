'use strict';

/**
 * @ngdoc overview
 * @name sraSearchApp
 * @description
 * # sraSearchApp
 *
 * Main module of the application.
 */
angular
  .module('sraSearchApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ngMdIcons',
    'bw.paging',
    'toaster',
    'chart.js',
    'angularMoment'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        controllerAs: 'logout'
      })
      .when('/search/:projectId', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        controllerAs: 'search'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .when('/create-new-project', {
        templateUrl: 'views/create-new-project.html',
        controller: 'CreateNewProjectCtrl',
        controllerAs: 'createNewProject'
      })
      .when('/delete-project/:projectId', {
        templateUrl: 'views/delete-project.html',
        controller: 'DeleteProjectCtrl',
        controllerAs: 'deleteProject'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider){
	  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
	  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
	  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	  $httpProvider.defaults.withCredentials = true;
  })
  .config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('blue')
	    .accentPalette('yellow');
  });
