import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

// markup
const ImageCDN = ({ data }) => {
  const image = getImage(data.blogPost.avatar);

  return (
    <main>
      <h1 style>Image CDN</h1>
      <GatsbyImage image={image} alt="tree at sunset" />
    </main>
  );
};

export default ImageCDN;

// export const pageQuery = graphql`
// query {

// }
// `
