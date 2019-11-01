const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },

    notes: [{
        type: Schema.Types.ObjectId,
        ref: "note"
    }]
});

//Uses mongoose's model method to create our model from the above schema

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;