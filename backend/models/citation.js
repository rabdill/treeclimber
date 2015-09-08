var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var citeSchema = new Schema({
  person : {type: String},
	document : {type: String},
	number : {type: Number}
});

module.exports = {
  Citation: mongoose.model('citation', citeSchema)
};
