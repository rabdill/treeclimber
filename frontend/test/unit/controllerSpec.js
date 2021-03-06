'use strict';

var fake = {
	"people" : [
		{
			"name" : {
				"first" : "Richard",
				"middle" : "John",
				"last" : "Abdill",
				"suffix" : "III",
				"full" : "Richard Abdill"
			},
			"_id" : 12345,
			"id" : 12345,
			"age" : 81,
			"birth" : {
				"date" : "1989-11-01T05:00:00.000Z",
				"place" : "New York, NY",
				"dateprint" : "1989-11-01",
				"year" : 1989
			},
			"death" : {
				"date" : "2070-11-02T05:00:00.000Z",
				"place" : "The Moon",
				"dateprint" : "2070-11-02T",
				"year" : 2070
			}
		},
		{
			"name" : {
				"first" : "Lauren",
				"last" : "Llidba",
				"full" : "Lauren Llidba"
			},
			"_id" : 12346,
			"id" : 12346,
			"age" : 23,
			"birth" : {
				"date" : "1992-01-20T05:00:00.000Z",
				"place" : "Frederick, MD",
				"dateprint" : "1992-01-20",
				"year" : 1992
			}
		}
	],
	"documents" : [
		{
			_id : 0,
		  title : "The Codex",
			origin : "The Mines of Moria",
			source : "Wikipedia",
			description : "DO NOT READ you will die",
			transcript : "E pluribus cthulu... [unintelligible]",
		  files : ["firsttestfile.txt"]
		}
	],
	"relations" : [
		{
			_id : 1234,
			person1 : 0,
			person2 : 1,
			relation : "spouse"
		}
	],
	"citations" : [
		{
			person : 0,
			document : 0,
			number : 1
		}
	],
	"signature" : {
		bucket : "S3bucketWeee",
		signature : "a1b2c3",
		awsKey : "AAAA",
		policy : "a7$Lsa&"
	}
};

/* jasmine specs for controllers go here */
describe('Treeclimber controllers', function() {

  describe('HomeCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(module('treeclimber'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:3000/people').respond({"people" : fake.people});
			$httpBackend.expectGET('http://localhost:3000/documents').respond({"documents" : fake.documents});

      scope = $rootScope.$new();
      ctrl = $controller('HomeCtrl', {$scope: scope});
    }));


    it('should create "people" model with 2 people in it', function() {
      expect(scope.people).toBeUndefined();
      $httpBackend.flush();

      expect(scope.people.length).toEqual(2);
			expect(scope.people).toEqual(fake.people);
    });

		it('should create "documents" model with 1 document in it', function() {
      expect(scope.documents).toBeUndefined();
      $httpBackend.flush();

      expect(scope.documents.length).toEqual(1);
			expect(scope.documents).toEqual(fake.documents);
    });
  });

	describe('PeopleListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(module('treeclimber'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:3000/people').respond({"people" : fake.people});

      scope = $rootScope.$new();
      ctrl = $controller('PeopleListCtrl', {$scope: scope});
    }));


    it('should create "people" model with 2 people in it', function() {
      expect(scope.people).toBeUndefined();
      $httpBackend.flush();

      expect(scope.people.length).toEqual(2);
			expect(scope.people).toEqual(fake.people);
    });
  });

	describe('DocListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(module('treeclimber'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
			$httpBackend.expectGET('http://localhost:3000/documents').respond({"documents" : fake.documents});

      scope = $rootScope.$new();
      ctrl = $controller('DocListCtrl', {$scope: scope});
    }));

		it('should create "documents" model with 1 document in it', function() {
      expect(scope.documents).toBeUndefined();
      $httpBackend.flush();

      expect(scope.documents.length).toEqual(1);
			expect(scope.documents).toEqual(fake.documents);
    });
  });

	describe('ProfileCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(module('treeclimber'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;

			// THE REQUESTS:

			// listing the documents:
			$httpBackend.when('GET', 'http://localhost:3000/documents').respond({"documents" : fake.documents});

			// listing all the people:
			$httpBackend.when('GET', 'http://localhost:3000/people').respond({"people" : fake.people});

			// getting the default person's info:
      $httpBackend.when('GET', 'http://localhost:3000/people/0').respond({"person" : fake.people[0]});

			// listing the person's relatives:
			$httpBackend.when('GET', 'http://localhost:3000/people/relation/0').respond({"relations": fake.relations});

			// getting the relative's info:
			$httpBackend.when('GET', 'http://localhost:3000/people/1').respond({"person" : fake.people[1]});

			// listing the person's citations:
			$httpBackend.when('GET', 'http://localhost:3000/people/citation/0').respond({"citations": fake.citations});

		  scope = $rootScope.$new();
      ctrl = $controller('ProfileCtrl', {$scope: scope});
    }));

		// THE TESTS:
		it('should recognize we\'re looking for the default person ID', function() {
			$httpBackend.flush();
			expect(scope.personId).toEqual(0);
		});

		it('should know the requested person\'s information', function() {
      $httpBackend.flush();
      expect(scope.documents.length).toEqual(1);
			expect(scope.person).toEqual(fake.people[0]);
    });

		it('should populate a list of citations of length 1', function() {
      $httpBackend.flush();
      expect(scope.citations.length).toEqual(1);
    });

		it('should fetch the title of the referenced citation', function() {
      $httpBackend.flush();
      expect(scope.citations[0].doc.title).toEqual('The Codex');
    });
  });

	describe('UploadCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(module('treeclimber'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', 'http://localhost:3000/sign').respond(fake.signature);

      scope = $rootScope.$new();
      ctrl = $controller('UploadCtrl', {$scope: scope});
    }));


    it('should create \'signature\' model with a bunch of traits', function() {
      $httpBackend.flush();

      expect(scope.bucket).toEqual(fake.signature.bucket);
			expect(scope.signature).toEqual(fake.signature.signature);
			expect(scope.awsKey).toEqual(fake.signature.awsKey);
			expect(scope.policy).toEqual(fake.signature.policy);
			expect(scope.tstamp).toEqual(Date.now());	// this needs to be an inequality, in case the tests take more than one second
    });
  });

});
