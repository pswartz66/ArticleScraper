
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// libs used for scraping
const axios = require("axios");
const cheerio = require("cheerio");

// require our database models
// const db = require("./models");

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
app.use(express.static("public"));

// connect to the mongo DB

// deplyed version: using local version for testing app
// const MONGOOSE_URI = process.env.MONGOOSE_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect("mongodb://localhost/mongoHeadlines", { useUnifiedTopology: true });

// axios get method to scrape data and send back to client




// start the server
app.listen(PORT, function(){
    console.log("Application running @ http://localhost:" + PORT);
})


// get the root route and load handlebars home template
app.get("/", function(req, res){


    // load index.handlebars file at root window
    res.render("home");
    

});

// get the saved route and load handlebars saved template
app.get("/saved", function(req, res){

    
    // load index.handlebars file at root window
    res.render("saved");
    

});

