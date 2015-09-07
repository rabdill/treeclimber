var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var docSchema = new Schema({
  title : {type: String},
	origin : {type: String},
	source : {type: String},
	description : {type: String},
	transcript : {type: String},
  files : {type: [String]}
});

docSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = {
  Document: mongoose.model('document', docSchema)
};
