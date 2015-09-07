var Person = require('../models/person').Person;
var Document = require('../models/document').Document;
var initTree = require('../famdata.js');  // fetch all the initial data

exports.index = function(req, res) {
  Person.find({}, function(err, people) {
    if(err) {
      res.json(500, { message: err });
    } else {
      Document.find({}, function(err, documents) {
        if(err) {
          res.json(500, { message: err });
        } else {
          res.json(200, {
            people: people,
            docs: documents
          });
        }
      });
    }
  });
}

exports.profile = function(req, res) {
  Person.findOne({ '_id': req.params.id }, function(err, person) {
    if(err) {
      res.json(500, { message: err });
    } else {
      res.json(200, {
        person: person
      });
    }
  });
}

exports.init = function(req, res) {
  functionsComplete = 0;
  Person.remove({}, function(err) {
    if(err) {
      res.json(500, { message: "Old records could not be deleted: " + err })
    }

    Document.remove({}, function(err) {
      if(err) {
        res.json(500, { message: "Old records could not be deleted: " + err })
      }
      createPeople();
      createDocuments();
    });
  });

  function createPeople() {
    var completed = 0;
    var total = initTree.people.length; // all the regions

    for(var i=0,person; person = initTree.people[i]; i++) {
      var newPerson = new Person({
        name: {
          first: person.first,
          middle: person.middle,
          last: person.last,
          suffix: person.suffix
        },
      	birth : {
      		date: person.bday,
      		place: person.bplace
      	},
      	death : {
      		date: person.dday,
      		place: person.dplace
      	},
      	epitaph : person.epitaph
      });
      console.log("Starting creation process for " + person.first);

      // save the region (doesn't have to wait for the units?!)
      newPerson.save(function(err) {
        if(err) {
          res.json(500, {message: "Initialization failed. Could not create new family tree. Error: " + err});
        } else {
          completed++;
          if(completed === total) {
            functionsComplete++;
            if(functionsComplete === 2) { // if it's the last to be done
              res.json(201, { message: "New tree prepared." });
            }
          }
        }
      });
    } // end of the loop going through each family member
  } // end of createPeople();

  function createDocuments() {
    var completed = 0;
    var total = initTree.documents.length; // all the regions

    for(var i=0,doc; doc = initTree.documents[i]; i++) {
      var newDoc = new Document({
        title : doc.title,
      	origin : doc.origin,
      	source : doc.source,
      	description : doc.description,
      	transcript : doc.transcript,
      });

      for(var j=0,file; file = doc.files[j]; j++) {
        newDoc.files.push(file);
      }
      // save the region (doesn't have to wait for the units?!)
      newDoc.save(function(err) {
        if(err) {
          res.json(500, {message: "Initialization failed. Could not create new document. Error: " + err});
        } else {
          completed++;
          if(completed === total) {
            functionsComplete++;
            if(functionsComplete === 2) { // if it's the last to be done
              res.json(201, { message: "New tree prepared." });
            }
          }
        }
      });
    } // end of the loop going through each family member
  } // end of createDocuments();
}
