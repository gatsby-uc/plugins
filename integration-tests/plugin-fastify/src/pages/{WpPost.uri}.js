import * as React from "react";
import { graphql } from "gatsby";

import PostPage from "../components/Post";

export default function wpPostPage({ data: { wpPost } }) {
  return <PostPage title={wpPost.title} content={wpPost.content} />;
}

export const pageQuery = graphql`
  query wpPost($uri: String!) {
    wpPost(uri: { eq: $uri }) {
      title
      content
    }
  }
`;
