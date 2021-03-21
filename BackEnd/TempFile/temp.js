
    const path=require("path");
    let file="Jitul.html";
    let nameis=file.split('.').slice(0, -1).join('.');
    let extension=file.split('.').slice
    let newname=`${nameis}-${Date.now()}`;
    console.log(path.parse(file).ext);