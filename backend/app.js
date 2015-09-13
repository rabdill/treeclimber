var express = require('express');
var http = require('http');
var people = require('./routes/people');
var documents = require('./routes/documents');
var citations = require('./routes/citations');
var relations = require('./routes/relations');
var mongoose = require('mongoose');
var cors = require('cors')

// DB connection:
mongoose.connect('mongodb://localhost/treeclimber');

var app = express();

// all environments
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// ROUTES HERE!
app.get('/people', people.index);
app.get('/people/:id', people.find);
app.post('/people/register', people.create);
app.put('/people/:id', people.update);
app.get('/people/citation/:id', citations.find);
app.post('/people/citation', citations.create);
app.post('/people/citation/remove', citations.delete);
app.post('/people/relation', relations.create);
app.get('/people/relation/:id', relations.find);
app.post('/people/relation/remove', relations.delete);


app.get('/sign', documents.sign);
app.get('/documents', documents.index);
app.post('/documents/register', documents.register);

// Aaaaand here we go:
http.createServer(app).listen(app.get('port'), function(){
  console.log('Treeclimber Express server listening on port ' + app.get('port'));
});
