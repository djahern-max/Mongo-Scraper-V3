let mongoose = require("mongoose");

// Save a reference to the Schema constructor
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
    ref: "Note"
  }]
});

let Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;