var Person = require('../models/person').Person;
var Document = require('../models/document').Document;
var Citation = require('../models/citation').Citation;
var Relation = require('../models/relation').Relation;
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
      // find all the citations, to fill in the drop-down:
      Document.find({}, function(err, documents) {
        if(err) {
          res.json(500, { message: err });
        } else {
          Citation.find({ person : req.params.id }, function(err, citations) {
            if(err) {
              res.json(500, { message: err });
            } else {
              res.json(200, {
                person: person,
                documents: documents,
                citations: citations
              });
            }
          });
        }
      });
    }
  });
}

exports.listRelations = function(req, res) {
  var checked = 0;
  var relations = [];
  console.log(req.params.id);
  Relation.find({ person1 : req.params.id }, function(err, newRelations) {
    if(err) {
      res.json(500, { message: err });
    } else {
      console.log(newRelations);
      checked++;
      relations = relations.concat(newRelations);
      if(checked === 2) {
        res.json(200, {relations: relations});
      }
    }
  });
  Relation.find({ person2 : req.params.id }, function(err, newRelations) {
    if(err) {
      res.json(500, { message: err });
    } else {
      checked++;
      relations = relations.concat(newRelations);
      if(checked === 2) {
        res.json(200, {relations: relations});
      }
    }
  });
}

exports.update = function(req, res) {
  console.log(req.body);
  Person.findByIdAndUpdate(req.body._id, { $set:req.body}, function (err, data) {
    if (err) {
      res.json(500, {message: "Update failed. Error: " + err});
    }
    res.json(201, { message: "Person updated." });
  });
}

// new person:
exports.register = function(req, res) {
  var newPerson = new Person(req.body);

  newPerson.save(function(err) {
    if(err) {
      res.json(500, {message: "Creation failed. Could not create new person. Error: " + err});
    } else {
      res.json(201, { message: "New person created." });
    }
  });
}

exports.citation = function(req, res) {
  var newCitation = new Citation({
    person : req.body.personId,
  	document : req.body.docId
  });

  // find the next available "footnote" number:
  var query = Citation.where({ person: req.body.personId }).limit(1).select('number').sort('-number');
  query.find(function (err, response) {
    if (err) {
      res.json(500, { message: "Citations could not be retrieved: " + err })
    }
    if (response.length > 0) {
      newCitation.number = response[0].number + 1;
    } else {
      newCitation.number = 1;
    }

    newCitation.save(function(err) {
      if(err) {
        res.json(500, {message: "Creation failed. Could not create new citation. Error: " + err});
      } else {
        res.json(201, { message: "New citation created.", citation: newCitation });
      }
    });
  });
}

exports.relation = function(req, res) {
  var newRelation = new Relation({
    person1 : req.body.person1,
  	person2 : req.body.person2,
  	relation : req.body.relation
  });
  if(req.body.relation === "spouse") {
    newRelation.marriage.start = req.body.start;
    newRelation.marriage.end = req.body.end;
  }
  newRelation.save(function(err) {
    if(err) {
      res.json(500, {message: "Creation failed. Could not create new relation. Error: " + err});
    } else {
      res.json(201, { message: "New relation created.", relation: newRelation });
    }
  });
}

// put in the starter data:
exports.init = function(req, res) {
  functionsComplete = 0;
  Person.remove({}, function(err) {
    if(err) {
      res.json(500, { message: "Old people could not be deleted: " + err });
    }

    Document.remove({}, function(err) {
      if(err) {
        res.json(500, { message: "Old documents could not be deleted: " + err });
      }

      Citation.remove({}, function(err) {
        if(err) {
          res.json(500, { message: "Old citations could not be deleted: " + err });
        }
        createPeople();
        createDocuments();
      });
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
      		date: person.bdate,
      		place: person.bplace
      	},
      	death : {
      		date: person.ddate,
      		place: person.dplace
      	},
      	biography : person.biography
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
