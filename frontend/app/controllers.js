var treeControllers = angular.module('treeControllers', [
	'ngRoute'
]);

treeControllers.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('http://localhost:3000/people').success(function(data) {
  	$scope.people = data.people;
	});
	$http.get('http://localhost:3000/documents').success(function(data) {
  	$scope.documents = data.documents;
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
	$scope.relations = [];

	$http.get('http://localhost:3000/people/' + $scope.personId).success(function(data) {
  	$scope.person = data.person;
	});

	// for finding the name of the relations:
	var findName = function(search, position) {
		$http.get('http://localhost:3000/people/' + search).success(function(data) {
			$scope.relations[position].otherName = data.person.name.full;
		});
	}
	// for fetching the relations:
	var getRelations = function() {
		$http.get('http://localhost:3000/people/relation/' + $scope.personId).success(function(data) {
			for(var i=0, rel; rel = data.relations[i]; i++) {
				var position1 = false; // whether the person being profiled is person 1 or not
				var search;
				$scope.relations[i] = {};
				$scope.relations[i].id = rel._id;
				// figuring out which person is the "other" person:
				if(rel.person1 === $scope.personId) {
					$scope.relations[i].otherId = rel.person2;
					position1 = true;
				} else {
					$scope.relations[i].otherId = rel.person1;
				}

				switch(rel.relation) {
					case "spouse":
						$scope.relations[i].relation = "Spouse";
						break;
					case "parent":
						$scope.relations[i].relation = position1 ? "Child" : "Parent";
						break;
				}
				findName($scope.relations[i].otherId, i);
			}
		});
	}

	// get the relations:
	getRelations();

	// translate a document ID into its object:
	var getDoc = function(docId) {
		for(var i=0,doc; doc = $scope.documents[i]; i++) {
			if(doc._id === docId) {
				return doc;
			}
		}
		return false;
	};
	// get the documents:
	$http.get('http://localhost:3000/documents').success(function(data) {
		$scope.documents = data.documents;
		// get the citations:
		$http.get('http://localhost:3000/people/citation/' + $scope.personId).success(function(data) {
			console.log(data);
			$scope.citations = data.citations;
			// find the citation titles:
			if($scope.citations.length > 0) {
				for(var i=0,cite; cite = $scope.citations[i]; i++) {
					cite.doc = getDoc(cite.document);
				}
			}
		});
	});
	$scope.editing = false;

	// get all the people, for adding relations
	$http.get('http://localhost:3000/people').success(function(data) {
  	$scope.people = data.people;
	});

	$scope.switchEdit = function() {
		$scope.editing = !$scope.editing;
	};

	$scope.update = function() {
		$http.post('http://localhost:3000/people/update',$scope.person).success(function(data) {
			console.log(data);
			$scope.editing = false;
		});
	};

	$scope.addcite = function() {
		var params = {
			personId : $scope.personId,
			docId : $scope.citation_to_add
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
	};

	$scope.addrel = function() {
		console.log($scope.personId);
		var params = {};
		switch($scope.how_related) {
			case "child":
				params.person1 = $scope.relation_to_add;
				params.person2 = $scope.personId;
				params.relation = "parent";
				break;
			default:
				params.person1 = $scope.personId;
				params.person2 = $scope.relation_to_add;
				params.relation = $scope.how_related;
		}

		$http.post('http://localhost:3000/people/relation',params).success(function(data) {
			console.log(data);
			// get an updated version of the relations:
			getRelations();
		});
	};

	$scope.delCite = function(cite) {
		var answer = confirm("Are you sure you want to remove the link between this person and the document titled '" + cite.doc.title + "'?")
		if(answer) {
			$http.post('http://localhost:3000/people/citation/remove',cite).success(function(data) {
				console.log(data);
			});
		}
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
