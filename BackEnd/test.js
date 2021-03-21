const cmd =require("node-cmd");
var file = "jitul.txt";
var asd = "bnycdn cp -s zone1 ./upload/"+file+" ./teststoragezone123/upload/"+file
const com= cmd.runSync(asd);

console.log(asd);
