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
    d
})