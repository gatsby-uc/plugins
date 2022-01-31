import * as React from "react";
import PostPage from "../components/Post";
import { graphql } from "gatsby";

export default function postPage1({ data }) {
  return <PostPage title={data.nameData.lorem.words} content={data.nameData.lorem.paragraphs} />;
}

export const query = graphql`
  query fakerPostQuery($slug: String!) {
    nameData(lorem: { slug: { eq: $slug } }) {
      lorem {
        paragraphs
        slug
        words
      }
    }
  }
`;
