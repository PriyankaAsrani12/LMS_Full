// const express = require("express");
// const app = express();
// const path = require("path");
// const mongoose = require("mongoose");
// // const url = "mongodb://localhost/db";
// // console.log('❓',process.env.MONGO_URI);
// // const url = process.env.MONGO_URI;
// const url =
//   "mongodb+srv://admin:rUfn8zyboxYjpzYY@cluster0.gynnv.mongodb.net/sampledb?retryWrites=true&w=majority";
// mongoose.connect(url, {
//   useNewUrlParser: true,
// });
// console.log(__dirname);
// app.use(express.static(__dirname + "/themesedittor/public"));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/themesedittor/views"));
// // app.use(express.static("/public"));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const con = mongoose.connection;
// con.on("open", () => {
//   console.log("connected");
// });
// // app.use("/", express.static(path.join(__dirname, "/public")));
// //this line execute index.js in api folder
// // app.use("/api", require("./routes/index").route);
// app.use("/api", require("../src/themesedittor/routes/index").route);
// app.listen(3333);

// app.use("/edit/:id", (req, res) => {
//   const themeid = req.params.id;
//   res.render("edit", { themeid });
// });

// app.use("/editnewsletter", (req, res) => {
//   // const themeid = req.params.id;
//   // res.render("edit", { themeid });
//   res.render("editnewsletter");
// });

// // module.exports = app;

const express = require("express");
const app = express();
// const router = require('express').Router();
const path = require("path");
const mongoose = require("mongoose");
// const url = "mongodb://localhost/db";
const url =
  "mongodb+srv://admin:rUfn8zyboxYjpzYY@cluster0.gynnv.mongodb.net/sampledb?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/themes/views"));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/themes/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const con = mongoose.connection;
con.on("open", () => {
  console.log("connected");
});
// app.use("/", express.static(path.join(__dirname, "/public")));
//this line execute index.js in api folder
app.use("/api", require("./themes/routes/index").route);
// app.listen(3333);

app.use("/edit/:id", (req, res) => {
  console.log('jha aa rha hai')
  const themeid = req.params.id;
  res.render("edit", { themeid });
});

app.use("/editnewsletter", (req, res) => {
  // const themeid = req.params.id;
  // res.render("edit", { themeid });
  res.render("editnewsletter");
});

module.exports = app