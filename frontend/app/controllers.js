var treeControllers = angular.module('treeControllers', [
	'ngRoute'
]);

treeControllers.controller('PeopleListCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/people').success(function(data) {
  	$scope.people = data.people;
		console.log(data);
	});
}]);

treeControllers.controller('DocListCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/documents').success(function(data) {
  	$scope.documents = data.documents;
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

//	form for uploading a new file
treeControllers.controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/sign').success(function(data) {
		$scope.bucket = data.bucket;
		$scope.signature = data.signature;
		$scope.awsKey = data.awsKey;
		$scope.policy = data.policy;
	});
}]);

//	success page after it's uploaded
treeControllers.controller('UploadedCtrl', ['$scope', '$http', function ($scope, $http) {
	var getVars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		getVars[key] = value;
	});
	$scope.filename = getVars.key;
	$scope.registered = false;
	$scope.status = "Now, it's time to register your file as an official document:";

	$scope.create = function() {
		var params = {
			title : $scope.title,
	    origin : $scope.origin,
	    source : $scope.source,
	    description : $scope.description,
	    transcript : $scope.transcript,
	    filename : $scope.filename
		};
		$http.post('http://localhost:3000/documents/register',params).success(function(data) {
			$scope.registered = true;
			$scope.status = "DONE! WOOOO!";
		});
	}
}]);
