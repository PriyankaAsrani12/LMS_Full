const cmd =require("node-cmd");

const com= cmd.runSync('bnycdn cp -s zone1 -R ./upload/ ./teststoragezone123/upload/');
console.log(com);
