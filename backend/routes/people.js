var Person = require('../models/person').Person;
var Document = require('../models/document').Document;
var Citation = require('../models/citation').Citation;
var Relation = require('../models/relation').Relation;

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

// fix up an existing person:
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

// new citation:
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

// new relation:
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
