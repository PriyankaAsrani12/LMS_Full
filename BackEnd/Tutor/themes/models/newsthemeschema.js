const mongoose = require("mongoose");

const newsletterthemes = new mongoose.Schema({
  themeid: { type: Number, required: true },
  html: { type: String, required: true },
});

exports = module.exports = mongoose.model("newsletterthemes", newsletterthemes);
