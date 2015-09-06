var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var personSchema = new Schema({
  name: {
    first: String,
    last: String
  },
	birth : {
		date: Date,
		place: String
	},
	death : {
		date: Date,
		place: String
	},
	epitaph : {type: String}
});

module.exports = {
  Person: mongoose.model('person', personSchema)
};
