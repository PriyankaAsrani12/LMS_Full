const route = require("express").Router();
const newsletterthemes = require("../models/newsthemeschema");

route.get("/", async (req, res) => {
  try {
    const datavalues = await newsletterthemes.find();
    res.json(datavalues);
  } catch (err) {
    res.send("error" + err);
  }
});

route.get("/:themeid", async (req, res) => {
  try {
    // const datavalue = await htmlthemes.findById(req.params.id);
    const datavalue = await newsletterthemes.findOne({
      themeid: req.params.themeid,
    });
    res.json(datavalue);
  } catch (err) {
    res.send("error" + err);
  }
});

route.post("/", async (req, res) => {
  const value = new newsletterthemes({
    themeid: req.body.themeid,
    html: req.body.html,
    // css: req.body.css,
  });
  try {
    const v1 = await value.save();
    res.json(v1);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

route.post("/store/:themeid", async (req, res) => {
  try {
    const datavalue = await newsletterthemes.updateOne(
      {
        themeid: req.params.themeid,
      },
      { html: req.body.html }
    );

    res.json(datavalue);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

exports = module.exports = route;
