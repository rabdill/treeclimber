var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var personSchema = new Schema({
  name: {
    first: String,
    middle: String,
    last: String,
    suffix: String
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

personSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

personSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = {
  Person: mongoose.model('person', personSchema)
};
