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
    'bw.paging'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider){
	  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
	  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
	  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  })
  .config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('blue')
	    .accentPalette('yellow');
  });
