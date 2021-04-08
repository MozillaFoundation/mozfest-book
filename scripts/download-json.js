const fetch = require("node-fetch");
const fs = require("fs");
//
const mozfestWpUrl = "https://mozfest-wp.jeroenbraspenning.nl/";
const pagesToFetch = ["index", "authors", "foreword-thank-you"];

let settings = { method: "Get" };

// loop through the pages and download
pagesToFetch.forEach((page) => {
  console.log(`Download - ${mozfestWpUrl + page}`);
  fetch(mozfestWpUrl + page, settings)
    .then((res) => res.json())
    .then((json) => {
      let jsonStr = JSON.stringify(json);
      // make absolute url relative
      jsonStr = jsonStr.replace(/https:\/\/mozfest-wp\.jeroenbraspenning\.nl\/wp-content\/uploads\//gi, "/media/");
      jsonStr = jsonStr.replace(/https:\/\/mozfest-wp\.jeroenbraspenning\.nl\//gi, "/");

      fs.writeFile(`./public/data/${page}.json`, jsonStr, function (err, result) {
        if (err) {
          console.log("error", err);
          return;
        }
        console.log(`Saved - ./public/data/${page}.json`);
      });
    });
});
