import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

const IndexPage = ({ data }) => (
  <main style={{ fontFamily: "monospace" }}>
    <h1>{data.site.siteMetadata.title}</h1>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(256px, 1fr))",
      }}
      className="images-grid"
    >
      {data.allS3Object.nodes.map((image) => (
        <div className={`s3-image ${image.Key}-${image.Bucket}`}>
          <GatsbyImage image={image.localFile.childImageSharp.gatsbyImageData} alt={image.Key} />
          <br />
          Key: {image.Key}
          <br />
          Bucket: {image.Bucket}
        </div>
      ))}
    </div>
  </main>
);

export const IMAGES_QUERY = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allS3Object {
      nodes {
        Key
        Bucket
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FIXED, width: 256)
          }
        }
      }
    }
  }
`;

export default IndexPage;
