var Document = require('../models/document').Document;
var initTree = require('../famdata.js').documents;  // fetch all the initial data

exports.index = function(req, res) {
  Document.find({}, function(err, documents) {
    if(err) {
      res.json(500, { message: err });
    } else {
      res.json(200, {
        documents: documents
      });
    }
  });
}
