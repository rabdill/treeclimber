var treeControllers = angular.module('treeControllers', [
	'ngRoute'
]);

// all the general stuff that's always there:
//		* note to self: this is almost certainly wrong.
treeControllers.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/people').success(function(data) {
  	$scope.people = data.people;
	});

	$scope.newTree = function() {
		$http.post('http://localhost:3000/init').success(function(data) {
			console.log(data);
		});
	}
}]);

treeControllers.controller('ProfileCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $scope.personId = $routeParams.personId; // the region being attacked
		$http.get('http://localhost:3000/people/' + $scope.personId).success(function(data) {
	  	$scope.person = data.person;
			console.log(data);
		});
	}
]);
