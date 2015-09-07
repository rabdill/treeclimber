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
  photo : {type: String},
  biography : {type: String}
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

personSchema.virtual('alive').get(function () {
  return this.death.date ? false : true;
});

personSchema.virtual('age').get(function () {
  var currentYear = new Date().getFullYear()
  return this.alive ? currentYear - this.birth.year : this.death.year - this.birth.year;
});

personSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = {
  Person: mongoose.model('person', personSchema)
};
