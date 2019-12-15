
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const path = require("path");


// libs used for scraping
const axios = require("axios");
const cheerio = require("cheerio");

// require our database models
const db = require("./models");

// set up local host port
let PORT = 3000;

// initialize express
const app = express();


// initalize express-handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
    })
);

app.set("view engine", "handlebars");


// morgan logger for loggin requests
app.use(logger("dev"));

// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make the public folder static
app.use('/public', express.static(path.join(__dirname + "/public")));

// connect to the mongo DB
// deplyed version: using local version for testing app
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });
const MONGOOSE_URI = process.env.MONGOOSE_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGOOSE_URI);



// start the server
app.listen(PORT, function () {
    console.log("Application running @ http://localhost:" + PORT);
})


// get the web scraped data in scrape route, create db collection
app.get("/scrape", function (req, res) {

    axios.get("https://theundefeated.com/sports/").then(function (response) {

        const $ = cheerio.load(response.data);

        console.log($);

        $("section").each(function (i, ele) {

            let result = {};

            result.title = $(this).find(".heading").text();
            result.body = $(this).find(".subheading").text();
            result.link = $(this).find(".heading").parent('a').attr('href');
            result.saved = false;

            console.log(result);
            // res.json(result);


            // create our db collection
            db.Article.create(result).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });


        });

        res.send("scrape complete");

    }).catch(function (err) {
        console.log(err);
    });


});


// get all articles from db here
app.get("/", function (req, res) {

    db.Article.find({}, function (err, dbData) {

        const hbsObject = {
            articles: dbData
        };

        // load index.handlebars file at root window
        res.render("home", hbsObject);

    });


});



// get the saved route and load handlebars saved template
app.get("/saved", function (req, res) {
    db.Article.find({saved: true}, function (err, updatedDB) {
        if (err) {
            console.log(err)
        } else {
            const hbsObject = {
                articles: updatedDB
            };
            // load saved.handlebars file at saved path
            res.render("saved", hbsObject);
        }
    });
});

// update a saved article in the db, change saved: true
app.post("/saved/:id", function (req, res) {
    let savedArticleID = req.params.id;
    db.Article.updateOne({ _id: savedArticleID }, { saved: true }).then(function (err, updatedDB) {
        if (err) {
            console.log(err)
        } else {
            res.send(updatedDB);
        }
    });
});