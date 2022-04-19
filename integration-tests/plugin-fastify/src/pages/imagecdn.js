import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
export default function StuffsArchive({ data }) {
  return (
    <main>
      <h1>Gatsby Image CDN Image</h1>
      <p>here's some content</p>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
      <GatsbyImage image={data.testImage.gatsbyImage} />
    </main>
  );
}

export const pageQuery = graphql`
  query TestImage {
    testImage(id: { eq: "test-image" }) {
      gatsbyImage(width: 1024)
    }
  }
`;
