const cmd =require("node-cmd");
var file = "jitul.txt";
var asd = "bnycdn cp -s oye-jitul-57 ./upload/"+file+" ./oye-jitul-57/upload/"+file
const com= cmd.runSync(asd);

console.log(asd);
