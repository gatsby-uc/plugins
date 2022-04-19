import * as React from "react";
import { graphql } from "gatsby";

import PostPage from "../components/Post";

export default function wpPostPage({ data: { wpPost } }) {
  return <PostPage title={wpPost.title} content={wpPost.content} />;
}

// export const pageQuery = graphql`
//   query testData($id: String!) {
//     testData(id: { eq: $id }) {
//       title
//       content
//       image {
//         gatsbyImage(
//           width: 1024
//           )
//       }
//     }
//   }
// `;
