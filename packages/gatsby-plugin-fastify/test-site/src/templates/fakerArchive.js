import * as React from "react";
import { Link } from "gatsby";

export default function fakerData({ pageContext: { posts } }) {
  return (
    <>
      <h1>Faker Entries</h1>
      <ol>
        {posts.map(({ lorem, name }) => {
          return (
            <li key={lorem.slug}>
              <Link to={`/faker/${lorem.slug}`}>
                {lorem.words} - {name.firstName} {name.lastName}
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
