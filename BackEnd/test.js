const cmd =require("node-cmd");
var file = "jitul.txt";
var asd = "rm ./upload/jitul.txt";
const com= cmd.runSync(asd);

console.log(asd);
