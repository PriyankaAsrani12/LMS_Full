
console.log('🔥 mil gayi')

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
        storeComponents: true, // Enable/Disable storing of components in JSON format
        storeStyles: true, // Enable/Disable storing of rules in JSON format
        storeHtml: true, // Enable/Disable storing of components as HTML string
        storeCss: true, // Enable/Disable storing of rules as CSS string

        type: "remote",
        // stepsBeforeSave: 3,
        urlStore: `http://localhost:5000/themes/api/database/store/${themeid}`,
        urlLoad: `http://localhost:5000/themes/api/database/${themeid}`,
        // urlLoad: "http://localhost:27017/db/htmlthemes/1",
        // // For custom parameters/headers on requests
        // params: { _some_token: "...." },
        // headers: { Authorization: "Basic ..." },
      },
      styleManager: {
        sectors: [
          {
            name: "General",
            open: false,
            buildProps: [
              "float",
              "display",
              "position",
              "top",
              "right",
              "left",
              "bottom",
            ],
          },
          {
            name: "Flex",
            open: false,
            buildProps: [
              "flex-direction",
              "flex-wrap",
              "justify-content",
              "align-items",
              "align-content",
              "order",
              "flex-basis",
              "flex-grow",
              "flex-shrink",
              "align-self",
            ],
          },
          {
            name: "Dimension",
            open: false,
            buildProps: [
              "width",
              "height",
              "max-width",
              "min-height",
              "margin",
              "padding",
            ],
          },
          {
            name: "Typography",
            open: false,
            buildProps: [
              "font-family",
              "font-size",
              "font-weight",
              "letter-spacing",
              "color",
              "line-height",
              "text-shadow",
            ],
          },
          {
            name: "Decorations",
            open: false,
            buildProps: [
              "border-radius-c",
              "color",
              "background-color",
              "border-radius",
              "border",
              "box-shadow",
              "background",
            ],
          },
          {
            name: "Extra",
            open: false,
            buildProps: ["transition", "perspective", "transform"],
          },
        ],
      },
    });

    editor.BlockManager.add("testBlock", {
      label: "Block",
      attributes: { class: "gjs-fonts gjs-f-b1" },
      content: `<div style="padding-top:50px; padding-bottom:50px; text-align:center">Test block</div>`,
    });
    editor.BlockManager.add("testImage", {
      label: "Image",
      attributes: { class: "gjs-fonts gjs-f-b1" },
      content: `<div style="padding-top:50px; padding-bottom:50px; text-align:center"><img></div>`,
    });
    // editor.load((res) => {
    //   console.log(res);

    //   changehtml = res.html;
    //   changecss = res.css;
    // });
    // editor.store((res) => {
    //   console.log("stored items");
    //   console.log(res);
    // });
    // editor.on("storage:load", function (e) {
    //   console.log("Loaded ", e);
    //   // editor.render();
    // });
    editor.on("storage:store", function (e) {
      console.log("stored ", e.html);
      // editor.render();
      $.post(
        `/api/database/store/${themeid}`,
        {
          themeid: `${themeid}`,
          html: e.html,
          css: e.css,
        },
        () => {
          console.log("theme updated in database");
        }
      );
    });
  });
});
// function save() {
//   console.log("cvjasxjaskdnxqwm" + changehtml);
//   console.log("button clicked");
//   if (changehtml != null && changehtml != "") {
//     $.post(
//       `/api/database/store/${themeid}`,
//       {
//         themeid: 1,
//         html: changehtml,
//         css: changecss,
//       },
//       () => {
//         console.log("theme updated in database");
//       }
//     );
//   }
// }
