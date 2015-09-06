var Person = require('../models/person').Person;
var initTree = require('../famdata.js').people;  // fetch all the initial data

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
}

exports.init = function(req, res) {
  Person.remove({}, function(err) {
    if(err) {
      res.json(500, { message: "Old records could not be deleted: " + err })
    }

    var completed = 0;
    var total = Object.keys(initTree).length; // all the regions

    for(var i=0,person; person = initTree[i]; i++) {
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
            res.json(201, { message: "New tree prepared." });
          }
        }
      });
    } // end of the loop going through each family member
  }); // end of callback in the "remove all the people" call that starts everything off
}
