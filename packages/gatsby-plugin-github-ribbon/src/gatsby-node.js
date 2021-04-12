import fs from "fs"
import request from "request"
import { buildImgUrl } from "./common"

exports.onPostBootstrap = (args, pluginOptions) =>
  new Promise((resolve, reject) => {
    const { color, position } = pluginOptions

    // Build url
    const url = buildImgUrl(color, position)

    // Create image file
    var file = fs.createWriteStream(`public/github_ribbon.png`)

    //download image to file
    request
      .get(url)
      .on(`error`, function (err) {
        reject(`Error retrieving github-ribbon: ${err}`)
      })
      .pipe(file)

    resolve()
  })
