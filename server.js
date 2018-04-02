//Dependencies 
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");
var mongojs = require("mongojs");

//Initialize express
var app = express();

//Database configuration 
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//Hook mongojs configuration to the db variable 
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

//Retrieve data from the db
app.get("/all", function(req, res) {
    db.scrapedData.find({}, function(error, found) {
        if(error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

//Scrape data from chosen site and store it into the mongo db 
app.get("/scrape", function(req, res) {
    request("https://www.washingtonpost.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        $(".c0kRRTkuz1j20q").each(function(i, element) {
            var $a = $(element).children('a');
            var title = $a.text();
            var link = $a.attr("href");
            if(title && link) {
                db.scrapedData.insert({
                    title: title, 
                    link: link
                },
                function(err, inserted) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(inserted);
                    }
                });
            }
        });
    });
    res.send("Scrape Complete");
});

//Listen on port 5150
app.listen(5150, function() {
    console.log("App running on port 5150!");
});



