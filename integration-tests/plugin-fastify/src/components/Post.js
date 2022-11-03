import * as React from "react";
import { Link } from "gatsby";

export default function PostPage({ title, content }) {
  return (
    <article>
      <Link to="/">Return to Home</Link>

      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
