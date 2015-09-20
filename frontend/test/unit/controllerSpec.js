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
		  title : "The Codex",
			origin : "The Mines of Moria",
			source : "Wikipedia",
			description : "DO NOT READ you will die",
			transcript : "E pluribus cthulu... [unintelligible]",
		  files : ["firsttestfile.txt"]
		}
	]
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

});
