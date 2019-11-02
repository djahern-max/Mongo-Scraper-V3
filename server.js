//Dependencies

const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

//Requires models

let db = require('./models');

let PORT = process.env.PORT || 5000;

let app = express();

//middleware

app.use(logger('dev'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static('public'));

//handlebars

let exphbs = require('express-handlebars');
app.engine(
    'handlebars',
    exphbs({
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, '/views/layouts/partials')
    })
);
app.set('view engine', 'handlebars');

//mongoDB connection

// let MONGODB_URI = process.env.MONGODB_URI;
let MONGODB_URI =
    'mongodb+srv://Dane123:Dane123@cluster0-zak6j.mongodb.net/test?retryWrites=true&w=majorityprocess.env.MONGODB_URI';

mongoose.connect(MONGODB_URI);

// Displays unsaved articles on the homepage

app.get('/', function (req, res) {
    db.Article.find({
            saved: false
        })
        .then(function (result) {
            var hbsObject = {
                articles: result
            };
            res.render('index', hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get('/scraped', function (req, res) {
    axios.get('http://www.artnews.com/category/news/').then(function (response) {
        var $ = cheerio.load(response.data);

        $('h2.entry-title').each(function (i, element) {
            var result = {};

            result.title = $(element).text();

            result.link = $(element)
                .children('a')
                .attr('href');

            result.summary = $(element)
                .siblings('.entry-summary')
                .text()
                .trim();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
    });
    res.send('Scrape Complete');
});

//Displays saved articles

app.get('/saved', function (req, res) {
    db.Article.find({
            saved: true
        })
        .populate('notes')
        .then(function (result) {
            var hbsObject = {
                articles: result
            };
            res.render('saved', hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Posts saved articles

app.post('/saved/:id', function (req, res) {
    db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                saved: true
            }
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Deletes artices in the saved section and inserts them back on the home page

app.post('/delete/:id', function (req, res) {
    db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                saved: false
            }
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//For addign notes on a specific article

app.get('articles/:id', function (req, res) {
    db.Article.fundOne({
            _id: req.params.id
        })
        .populate("notes")
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Creates articles associated with notes

app.post('/articles/:id', function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                notes: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//For deleting notes

app.post('/deleteNote/:id', function (req, res) {
    db.Note.remove({
            _id: req.params.id
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));