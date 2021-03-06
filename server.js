// Dependencies
let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');
let path = require('path');
require("dotenv").config();

// Scraping tools
let axios = require('axios');
let cheerio = require('cheerio');

// Requiring all models
let db = require('./models');

// Initializing the port
let PORT = process.env.PORT || 3000;

// Initializing Express
let app = express();

// Middleware
// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Using Handlebars
let exphbs = require('express-handlebars');
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '/views/layouts/partials')
  })
);
app.set('view engine', 'handlebars');

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//Routes

// Shows all unsaved articles on homepage
app.get('/', function (req, res) {
  db.Article.find({
      saved: false
    })
    .then(function (result) {
      let hbsObject = {
        articles: result
      };
      res.render('index', hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Scrapes the artnews website for the article data
app.get('/scraped', function (req, res) {
  axios.get('http://www.artnews.com/category/news/').then(function (response) {
    let $ = cheerio.load(response.data);

    $('h2.entry-title').each(function (i, element) {
      let result = {};

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

// Displays specified saved articles
app.get('/saved', function (req, res) {
  db.Article.find({
      saved: true
    })
    .populate('notes')
    .then(function (result) {
      let hbsObject = {
        articles: result
      };
      res.render('saved', hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Posts saved articles
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

// Deletes specific articles from "Saved Articles" and puts them back on the homepage
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

// Grabs a specific article by id and populates it with it's note(s)
app.get('/articles/:id', function (req, res) {
  db.Article.findOne({
      _id: req.params.id
    })
    .populate('notes')
    .then(function (result) {
      res.json(result);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Creates an article's associated note(s)
app.post('/articles/:id', function (req, res) {
  // Create a new note and pass the req.body to the entry
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
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Deletes one note
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

// Clears all articles
// app.get("/clearall", function(req, res) {
//     db.Article.remove({})
//     .then(function(result) {
//         res.json(result);
//       })
//       .catch(function(err) {
//         res.json(err);
//       });
// })

// Starting the server
app.listen(PORT, function () {
  console.log('App running on port ' + PORT + '!');
});