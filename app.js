const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Song = require("./models/song");
const get_song = require("./scraper");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB
mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.qqopx.mongodb.net/rhymepedia?retryWrites=true&w=majority`
);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/api/song/:title/:artist", async (req, res) => {
  const song = await Song.find({
    title: req.params.title,
    artist: req.params.artist,
  });
  if (song.length === 0) {
    return res.json({
      message: "This song hasn't been added to the Rhymepedia database",
      status: 0,
    });
  } else {
    return res.json({
      song: song,
      status: 1,
    });
  }
});

app.get("/api/search/:search_input", async (req, res) => {
  const results = await get_song(req.params.search_input);
  res.json(results);
});

app.post("/api/create", async (req, res) => {
  const song = await Song.find({
    title: req.body.title,
    artist: req.body.artist,
  });
  if (song.length === 0) {
    await Song.create({
      title: req.body.title,
      artist: req.body.artist,
      lyrics: req.body.lyrics,
      lyrics_text: req.body.lyrics_text,
    });
    return res.status(200).json({ msg: "Song added" });
  } else {
    try {
      await Song.findOneAndUpdate(
        { title: req.body.title, artist: req.body.artist },
        {
          title: req.body.title,
          artist: req.body.artist,
          lyrics: req.body.lyrics,
          lyrics_text: req.body.lyrics_text,
        }
      );
      return res.status(200).json({ msg: "Song updated" });
    } catch {
      return res
        .status(500)
        .json({ msg: "An error occured while updating the document" });
    }
  }
});

app.listen(PORT, console.log(`Listening on port ${PORT}`));
