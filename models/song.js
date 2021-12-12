const mongoose = require("mongoose")

const songSchema = mongoose.Schema({
    title: String,
    artist: String,
    lyrics: String,
    text: String
})

module.exports = mongoose.model("Song", songSchema)