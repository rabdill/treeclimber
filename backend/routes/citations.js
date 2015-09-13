var Citation = require('../models/citation').Citation;

exports.find = function(req, res) {
	Citation.find({ person : req.params.id }, function(err, citations) {
	  if(err) {
	    res.json(500, { message: err });
	  } else {
	    res.json(200, {
	      citations: citations
	    });
	  }
	});
};

exports.delete = function(req, res) {
	Citation.remove({ _id: req.body._id }, function (err) {
		if(err) {
	    res.json(500, { message: err });
	  } else {
	    res.json(200, { message: "Citation removed." });
	  }
	});
};

exports.create = function(req, res) {
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
