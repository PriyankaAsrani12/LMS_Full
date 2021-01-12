const route = require("express").Router();
const { db, qa } = require("../database/models");

route.get("/", async (req, res) => {
  try {
    let data = await qa.findAll();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});
exports = module.exports = route;
