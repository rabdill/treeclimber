'use strict';

// Declare app level module which depends on views, and components
var tree = angular.module('treeclimber', [
  'ngRoute',
  'treeControllers'
]);

tree.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/people.html',
        controller: 'ListCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
	}
]);

tree.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);
