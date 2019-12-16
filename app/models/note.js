
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema ({

    // store notes as string's inside db, populated from textarea inside modal
    note: {
        type: String,
        required: true
    }
    

})

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;