const route = require("express").Router();

route.use("/database", require("./qa"));

exports = module.exports = {
  route,
};
