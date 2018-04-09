//Dependencies 
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');
var mongojs = require('mongojs');
var logger = require('morgan');

//Initialize express
var app = express();

//Declaring PORT variable 
var PORT = process.env.PORT || 5150

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//Set mongoose to leverage built in JavaScript ES6 Promises
//Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
  });
//Use morgan logger and body parser with app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

//To use handlebars and set handlebars engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var db = mongoose.connection;

db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//Require the routes in controller file 
require('./controllers/articlesController.js')(app);

//Listen on port 5150
app.listen(PORT, function() {
    console.log("App running on port 5150!");
});



