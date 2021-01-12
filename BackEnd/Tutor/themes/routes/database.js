const route = require("express").Router();
const htmlthemes = require("../models/themeschema");
route.get("/", async (req, res) => {
  try {
    const datavalues = await htmlthemes.find();
    res.json(datavalues);
  } catch (err) {
    res.send("error" + err);
  }
});

route.get("/:themeid", async (req, res) => {
  try {
    // const datavalue = await htmlthemes.findById(req.params.id);
    const datavalue = await htmlthemes.findOne({
      themeid: req.params.themeid,
    });
    res.json(datavalue);
  } catch (err) {
    res.send("error" + err);
  }
});

route.post("/", async (req, res) => {
  const value = new htmlthemes({
    themeid: req.body.themeid,
    html: req.body.html,
    css: req.body.css,
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
    const datavalue = await htmlthemes.updateOne(
      {
        themeid: req.params.themeid,
      },
      { html: req.body.html, css: req.body.css }
    );

    res.json(datavalue);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

exports = module.exports = route;
