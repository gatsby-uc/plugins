import * as React from "react";
import { graphql, Link } from "gatsby";
export default function StuffsArchive({ data }) {
  return (
    <main>
      <h1>Stuffs Archive</h1>
      <ul>
        {data.allWpPost.nodes.map((post) => (
          <li key={post?.id}>
            <Link to={post?.uri}>{post?.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

// export const pageQuery = graphql`
//   query {
//     allWpPost {
//       nodes {
//         id
//         uri
//         title
//       }
//     }
//   }
// `;
