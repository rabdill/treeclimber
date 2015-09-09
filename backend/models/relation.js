var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var relationSchema = new Schema({
  person1 : {type: String, required: true},
	person2 : {type: String, required: true},
	relation : {type: String, required: true},
	marriage : {
		start: Date,
		end: Date
	}
});

module.exports = {
  Relation: mongoose.model('relation', relationSchema)
};
