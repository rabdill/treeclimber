var Relation = require('../models/relation').Relation;

exports.find = function(req, res) {
	var checked = 0;
	var relations = [];
	Relation.find({ person1 : req.params.id }, function(err, newRelations) {
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
};

exports.create = function(req, res) {
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
};
