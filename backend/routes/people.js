var Person = require('../models/person').Person;
var Document = require('../models/document').Document;
var Citation = require('../models/citation').Citation;
var Relation = require('../models/relation').Relation;

exports.index = function(req, res) {
  Person.find({}, function(err, people) {
    if(err) {
      res.json(500, { message: err });
    } else {
      res.json(200, {
        people: people
      });
    }
  });
};

exports.find = function(req, res) {
  Person.findOne({ '_id': req.params.id }, function(err, person) {
    if(err) {
      res.json(500, { message: err });
    } else {
      res.json(200, {
        person: person
      });
    }
  });
};

// fix up an existing person:
exports.update = function(req, res) {
  console.log(req.body);
  Person.findByIdAndUpdate(req.body._id, { $set:req.body}, function (err, data) {
    if (err) {
      res.json(500, {message: "Update failed. Error: " + err});
    }
    res.json(201, { message: "Person updated." });
  });
};

// new person:
exports.create = function(req, res) {
  var newPerson = new Person(req.body);

  newPerson.save(function(err) {
    if(err) {
      res.json(500, {message: "Creation failed. Could not create new person. Error: " + err});
    } else {
      res.json(201, { message: "New person created." });
    }
  });
};
