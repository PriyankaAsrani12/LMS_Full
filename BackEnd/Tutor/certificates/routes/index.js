const { Router } = require("express");

const route = require("express").Router();

route.use("/database", require("./database"));
// route.use("/",require("../upload/upload") );
// route.use("/databasenewsletter", require("./databasenewsletter"));

exports = module.exports = {
  route,
};
