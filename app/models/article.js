
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({

    // title of our articles
    title: {
        type: String,
        required: true
    },

    // short text about the article
    body: {
        type: String,
        reuqired: true
    },

    // link to our article
    link: {
        type: String,
        required: true
    },

    // saved criteria allows us to change the state of an article in the db
    // used for getting saved articles back to front end saved template
    saved: {
        type: Boolean,
        default: false,
        required: true
    },

    // note field for joining notes to articles
    notes: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;