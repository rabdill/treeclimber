var Document = require('../models/document').Document;
var crypto = require('crypto');
var secrets = require('../secrets');
var bucket = secrets.s3.bucket;
var awsKey = secrets.s3.awsKey;
var secret = secrets.s3.secretKey;

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

exports.sign = function sign(req, res) {
	var expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString(); // 5 mins
	var policy = {
    "expiration": expiration,
		"conditions": [
			{"bucket": bucket},
      ["starts-with", "$success_action_redirect", "http"],
      {"acl": "public-read"},
			["starts-with", "$key", ""]
		]};
	policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
  signature = crypto.createHmac('sha1', new Buffer(secret, 'utf-8')).update(policyBase64).digest('base64');
  res.json(200, {
    bucket: bucket,
    awsKey: awsKey,
    policy: policyBase64,
    signature: signature
  });
}

exports.register = function register(req, res) {
  console.log(req);
  var newDoc = new Document({
    title : req.body.title,
    origin : req.body.origin,
    source : req.body.source,
    description : req.body.description,
    transcript : req.body.transcript,
    files : ["https://s3.amazonaws.com/treeclimber/" + req.body.filename]
  });

  newDoc.save(function(err) {
    if(err) {
      res.json(500, {message: "Initialization failed. Could not create new document. Error: " + err});
    } else {
      res.json(201, { message: "New document registered."});
    }
  });
}
