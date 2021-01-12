const mongoose = require("mongoose");

const htmlthemes = new mongoose.Schema({
  themeid: { type: Number, required: true },
  html: { type: String, required: true },
  css: { type: String, required: true },
});

exports = module.exports = mongoose.model("htmlthemes", htmlthemes);
