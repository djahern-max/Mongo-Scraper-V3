const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const axios = require("axios");

let db = require("./models");

let PORT = process.env.PORT || 5000;

let app = express();

//middleware

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

//handlebars

let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

//mongoDB connection

// let MONGODB_URI = process.env.MONGODB_URI;
let MONGODB_URI = "mongodb+srv://Dane123:Dane123@cluster0-zak6j.mongodb.net/test?retryWrites=true&w=majorityprocess.env.MONGODB_URI";

mongoose.connect(MONGODB_URI);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.get("/", function (req, res) {
    db.Article.find({
        'saved': false
    }).then(function (result) {
        let hbsObject = {
            articles: result
        };
        res.render("index", hbsObject);
    }).catch(function (err) {
        res.json(err)
    });
});

app.get("/scraped", function (req, res) {
    axios.get("https://news.ycombinator.com/").then(function (response) {
        let $ = cheerio.load(response.data);
        $("h2.entry-title").each(function (i, element) {
            let result = {};
            result.title = $(element).text();
            result.link = $(element).children("a").attr("href");
            result.summary = $(element).siblings('.entry-summary').text().trim();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
    });
    res.send("Scrape Complete")
});