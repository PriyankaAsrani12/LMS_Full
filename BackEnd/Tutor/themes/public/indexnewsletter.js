let themeid = 1;
var changehtml = "";
var changecss = "";
$(() => {
  var htmlObject = document.createElement("div");
  const gjsdiv = document.getElementById("gjs");

  async function getdata() {
    // await $.get(`/api/database/${themeid}`, async (Theme1) => {
    //   htmlObject.innerHTML = await Theme1.html;
    //   // console.log(Theme1.html);
    //   gjsdiv.innerHTML = "";
    //   gjsdiv.appendChild(htmlObject);
    //   // console.log(gjsdiv.innerHTML);
    // });
    console.log("getdata");
  }
  getdata().then(() => {
    console.log("inside then");
    // console.log(gjsdiv.innerHTML + "gjsinnerhtml");
    var editor = grapesjs.init({
      container: "#gjs",
      plugins: ["gjs-preset-newsletter"],
      pluginsOpts: {
        "gjs-preset-newsletter": {
          modalTitleImport: "Import template",
          // ... other options
        },
        showOffsets: 1,
        noticeOnUnload: 0,
        container: "#gjs",
        height: "100%",
        fromElement: true,
        storageManager: {
          // id: "gjs-", // Prefix identifier that will be used inside storing and loading
          // type: "local", // Type of the storage
          autosave: true, // Store data automatically
          autoload: true, // Autoload stored data on init
          stepsBeforeSave: 1, // If autosave enabled, indicates how many changes are necessary before store method is triggered
          //   storeComponents: true, // Enable/Disable storing of components in JSON format
          //   storeStyles: true, // Enable/Disable storing of rules in JSON format
          //   storeHtml: true, // Enable/Disable storing of components as HTML string
          //   storeCss: true, // Enable/Disable storing of rules as CSS string

          type: "remote",
          // stepsBeforeSave: 3,
          urlStore: `http://localhost:3333/api/databasenewsletter/store/${themeid}`,
          urlLoad: `http://localhost:3333/api/databasenewsletter/${themeid}`,
          // urlLoad: "http://localhost:27017/db/htmlthemes/1",
          // // For custom parameters/headers on requests
          // params: { _some_token: "...." },
          // headers: { Authorization: "Basic ..." },
        },
      },
    });
    editor.on("storage:store", function (e) {
      console.log("stored ", e.html);
      // editor.render();
      $.post(
        `/api/databasenewsletter/store/${themeid}`,
        {
          themeid: `${themeid}`,
          html: e.html,
          // css: e.css,
        },
        () => {
          console.log("theme updated in database");
        }
      );
    });
  });
});
