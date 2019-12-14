
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

    saved: {
        type: Boolean,
        default: false
    },

    // note field for joining notes to articles
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;