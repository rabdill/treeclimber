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

personSchema.virtual('birth.year').get(function () {
  return this.birth.date ? this.birth.date.getFullYear() : false;
});

personSchema.virtual('death.year').get(function () {
  return this.death.date ? this.death.date.getFullYear() : false;
});

personSchema.virtual('birth.dateprint').get(function () {
  return this.birth.date ? this.birth.date.toISOString().slice(0,10) : false;
});

personSchema.virtual('death.dateprint').get(function () {
  return this.death.date ? this.death.date.toISOString().slice(0,10) : false;
});

personSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = {
  Person: mongoose.model('person', personSchema)
};
