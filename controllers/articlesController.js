var request = require("request");
var cheerio = require('cheerio');
var Article = require("../models/Article.js");
var Comment = require("../models/Comment.js");

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect("/articles");
    });

    app.get("/scrape", function(req, res) {
        request("http://www.latimes.com/", function(error, response, html) {
            var $ = cheerio.load(html);
            var result = [];
            $("div.container.padded-container").each(function(i, element) {
                var title = $(element).text().children("h5").children("a").attr("href");
                var link = $(element).text().children("h5").children("a").attr("href");
                var articleSummary = $(element).children("h5").children("p.preview-text spaced-top story-preview spaced-md");

                if(title && link && articleSummary) {
                    var result = [];
                    result.title = title;
                    result.link = link;
                    result.articleSummary = articleSummary;

                    Article.create(result, function (err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(doc);
                        }
                    });
                }
            });
        });
        res.redirect('/');
    });

    //Get route to scrape off mongoDB
    app.get("/articles", function(req, res) {
        Article.find({}, function(err, doc) {
            if(err) {
                console.log(err);
            } else {
                res.render("index", {result: doc});
            }
        })
        .sort({'_id': -1});
    });

    //Grab article by its id
    app.get('/articles/:id', function(req,res) {
        Article.findOne({"_id": req.params.id})
        .populate('comment')
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.render("comments", {result: doc});
            }
        });
    });

    //Post route to create a new comment 
    app.post('/articles/:id', function(req,res){
        Comment.create(req.body, function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $push: {
                        "comment": doc._id
                    }
                }, {
                    upsert: true
                }).exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('back');
                    }
                });
            }
        });
    });

    //Delete route to delete comment
    app.delete('/articles/:id/:commentId', function(req, res) {
        Comment.findByIdAndRemove(req.params.commentId, function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
                Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $pull: {
                        "comment": doc._id
                    }
                }).exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                    }
                });
            }
        });
    });
};
