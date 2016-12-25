'use strict';

var express = require('express');
var routes = require('./app/routes/routes.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var pug = require('pug');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

app.set('view engine', 'pug')

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use('/bootstrap', express.static(process.cwd() + '/node_modules/bootstrap'));
app.use('/jquery', express.static(process.cwd() + '/node_modules/jquery'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
