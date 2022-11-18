import fs from "node:fs";
import request from "request";
import { buildImgUrl } from "./common";

export const onPostBootstrap = (_apis, pluginOptions) =>
  new Promise((resolve, reject) => {
    const { color, position } = pluginOptions;

    // Build url
    const url = buildImgUrl(color, position);

    // Create image file
    var file = fs.createWriteStream(`public/github_ribbon.png`);

    //download image to file
    request
      .get(url)
      .on(`error`, function (error) {
        reject(`Error retrieving github-ribbon: ${error}`);
      })
      .pipe(file);

    resolve();
  });
