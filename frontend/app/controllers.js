var treeControllers = angular.module('treeControllers', [
	'ngRoute'
]);

treeControllers.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/people').success(function(data) {
  	$scope.people = data.people;
		console.log(data);
	});
}]);

treeControllers.controller('ProfileCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $scope.personId = $routeParams.personId; // the region being attacked
		$http.get('http://localhost:3000/people/' + $scope.personId).success(function(data) {
	  	$scope.person = data.person;
			console.log(data);
		});
	}
]);

treeControllers.controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/sign').success(function(data) {
		$scope.bucket = data.bucket;
		$scope.signature = data.signature;
		$scope.awsKey = data.awsKey;
		$scope.policy = data.policy;
	});
}]);

treeControllers.controller('UploadedCtrl', ['$scope', '$http', function ($scope, $http) {
	var getVars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		getVars[key] = value;
	});

	$scope.filename = getVars.key

}]);
