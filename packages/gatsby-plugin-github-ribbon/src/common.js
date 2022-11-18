// Map for color values
const ribbonColors = new Map([
  [`red`, `aa0000`],
  [`green`, `007200`],
  [`darkblue`, `121621`],
  [`orange`, `ff7600`],
  [`gray`, `6d6d6d`],
  [`white`, `ffffff`],
]);

//function to create URL
export const buildImgUrl = (color, position) =>
  `https://s3.amazonaws.com/github/ribbons/forkme_${position}_${color}_${ribbonColors.get(
    color
  )}.png`;
