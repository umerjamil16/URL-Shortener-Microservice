module.exports = function(express, app) {
    var router = express.Router();

    var MongoClient = require("mongodb").MongoClient;

    var mongodb = require('mongodb');
    var shortid = require('shortid');
    var validUrl = require('valid-url');
    var mLab = "mongodb://user:password@ds047166.mlab.com:47166/url-mircoservice";

    var masterURL = "https://url-shortener-microservice-tonystark66.c9users.io/";

    // var db;
    // var collection = db.collection('links');
    // var params = req.params.url;

    var newLink = function(db, callback) {};


    router.get("/", function(req, res, next) {
        res.render("index", {});
    });
    router.get('/new/:url(*)', function(req, res, next) {
        MongoClient.connect(mLab, function(err, db) {
            if (err) {
                console.log("Unable to connect to server", err);
            } else {
                console.log("Connected to server")

                var collection = db.collection('links');
                var params = req.params.url;

                var newLink = function(db, callback) {
                    if (validUrl.isUri(params)) {
                        // if URL is valid, do this
                        var shortCode = shortid.generate();
                        var newUrl = {
                            url: params,
                            short: shortCode
                        };
                        collection.insert([newUrl]);
                        res.json({
                            original_url: params,
                            short_url: masterURL + shortCode
                        });
                    } else {
                        // if URL is invalid, do this
                        res.json({
                            error: "Wrong url format, make sure you have a valid protocol and real site."
                        });
                    };
                };
                newLink(db, function() {
                    db.close();
                });
            };
        });
    });

    router.get('/:short', function(req, res, next) {

        MongoClient.connect(mLab, function(err, db) {
            if (err) {
                console.log("Unable to connect to server", err);
            } else {
                console.log("Connected to server")

                var collection = db.collection('links');
                var params = req.params.short;

                var findLink = function(db, callback) {
                    collection.findOne({
                        "short": params
                    }, {
                        url: 1,
                        _id: 0
                    }, function(err, doc) {
                        if (doc != null) {
                            res.redirect(doc.url);
                        } else {
                            res.json({
                                error: "No corresponding shortlink found in the database."
                            });
                        };
                    });
                };

                findLink(db, function() {
                    db.close();
                });

            };
        });
    });
    app.use("/", router);
}