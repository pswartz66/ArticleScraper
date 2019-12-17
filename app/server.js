
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
        partialsDir: path.join(__dirname, "/views/layouts/partials")
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
                res.json(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });


        });

        res.send("scrape complete");

    }).catch(function (err) {
        console.log(err);
    });


});


// get all non-saved articles from db here
app.get("/", function (req, res) {

    db.Article.find({saved: false}, function (err, dbData) {

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
            // console.log(hbsObject);
        }
    });
});

// update a saved article in the db, change saved: true
app.post("/saved/:id", function (req, res) {
    let savedArticleID = req.params.id;
    db.Article.updateOne({ _id: savedArticleID }, { saved: true })

        /* .populate("notes") */
        .then(function (err, updatedDB) {
            if (err) {
                console.log(err)
            } else {
                res.send(updatedDB);
            }
    });
});


// clear non-saved articles from db and send back to home template
app.get("/cleared/non-saved", function (req, res) {
    db.Article.remove({saved: false}, function (err, updatedDB) {
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

// clear saved articles from db and send back to home template
app.get("/cleared/saved", function (req, res) {
    db.Article.remove({saved: true}, function (err, updatedDB) {
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


app.get("/saved/notes/:id", function(req, res) {

    db.Article.findOne({_id: req.params.id})

    .populate("notes")

    .then(function(notes){

        console.log(notes);

        res.send(notes);

    }).catch(function(err){
        if (err) {
            console.log(err);
        }
    })

})


// post the saved note in Note db, populate notes inside of Article db above
app.post("/saved/notes/:id", function(req, res){

    console.log('article id:' +req.params.id);
    db.Note.create(req.body).then(function(dbNote){

        // find id inside of Article collection and push the associated notes into the Article
        return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote._id}}, {new: true});
        

    }).then(function(dbArticle){

        res.json(dbArticle);

    }).catch(function(err){
        if(err) {
            res.json(err);
        }
    });

})