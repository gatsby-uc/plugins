"use strict"

// Map for color values
var ribbonColors = new Map([
  ["red", "aa0000"],
  ["green", "007200"],
  ["darkblue", "121621"],
  ["orange", "ff7600"],
  ["gray", "6d6d6d"],

  ["white", "ffffff"],
]) //function to create URL

exports.buildImgUrl = function (color, position) {
  return (
    "https://s3.amazonaws.com/github/ribbons/forkme_" +
    position +
    "_" +
    color +
    "_" +
    ribbonColors.get(color) +
    ".png"
  )
}
