'use strict';

// Declare app level module which depends on views, and components
var tree = angular.module('treeclimber', [
  'ngRoute',
  'treeControllers',
  'treeAnimations'
]);

tree.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/people', {
        templateUrl: 'partials/people.html',
        controller: 'PeopleListCtrl'
      }).
      when('/people/register', {
        templateUrl: 'partials/add_person.html',
        controller: 'AddPersonCtrl'
      }).
      when('/documents', {
        templateUrl: 'partials/documents.html',
        controller: 'DocListCtrl'
      }).
      when('/people/:personId', {
				templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl'
      }).
      when('/documents/add', {
				templateUrl: 'partials/upload_form.html',
        controller: 'UploadCtrl'
      }).
      when('/documents/uploaded', {
				templateUrl: 'partials/upload_complete.html',
        controller: 'UploadedCtrl'
      }).
      otherwise({
        redirectTo: '/people'
      });
	}
]);

tree.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);
