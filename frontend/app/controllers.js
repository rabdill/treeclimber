var treeControllers = angular.module('treeControllers', [
	'ngRoute'
]);

treeControllers.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/people').success(function(data) {
  	$scope.people = data.people;
	});
	$http.get('http://localhost:3000/documents').success(function(data) {
  	$scope.documents = data.documents;
		console.log(data);
	});
}]);

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
		$scope.documents = data.documents;
		$scope.citations = data.citations;

		for(var i=0,cite; cite = $scope.citations[i]; i++) {
			cite.doc = getDoc(cite.document);
		}
		console.log(data);
	});
	$scope.editing = false;

	// translate a document ID into its object:
	var getDoc = function(docId) {
		for(var i=0,doc; doc = $scope.documents[i]; i++) {
			if(doc._id === docId) {
				return doc;
			}
		}
		return false;
	};

	$scope.switchEdit = function() {
		$scope.editing = !$scope.editing;
	}

	$scope.update = function() {
		$http.post('http://localhost:3000/people/update',$scope.person).success(function(data) {
			console.log(data);
			$scope.editing = false;
		});
	}

	$scope.addcite = function() {
		var params = {
			personId : $scope.personId,
			docId : $scope.citation
		};
		$http.post('http://localhost:3000/people/citation',params).success(function(data) {
			console.log(data);
			// get an updated version of the citations:
			$http.get('http://localhost:3000/people/' + $scope.personId).success(function(data) {
				$scope.citations = data.citations;
				for(var i=0,cite; cite = $scope.citations[i]; i++) {
					cite.doc = getDoc(cite.document);
				}
				console.log(data);
			});
		});
	}
}]);

//	form for uploading a new file
treeControllers.controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/sign').success(function(data) {
		$scope.bucket = data.bucket;
		$scope.signature = data.signature;
		$scope.awsKey = data.awsKey;
		$scope.policy = data.policy;
		$scope.tstamp =  Date.now();
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
	$scope.status = $scope.filename + " uploaded successfully. Now, it's time to register your file as an official document:";

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

// creating a new person
treeControllers.controller('AddPersonCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.registered = false;
	$scope.status = "";

	$scope.create = function() {
		var params = {
			name : {
		    first: $scope.first,
		    middle: $scope.middle,
		    last: $scope.last,
		    suffix: $scope.suffix
		  },
			birth : {
				date: $scope.bdate,
				place: $scope.bplace
			},
			death : {
				date: $scope.ddate,
				place: $scope.dplace
			},
		  biography : $scope.biography
		};
		console.log(params);
		$http.post('http://localhost:3000/people/register',params).success(function(data) {
			console.log(data);
			$scope.registered = true;
			$scope.status = "DONE! WOOOO!";
		});
	}
}]);
