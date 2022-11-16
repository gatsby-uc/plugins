import * as React from "react";
import { Link, withPrefix } from "gatsby";
// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};
const headingAccentStyles = {
  color: "#663399",
};
const paragraphStyles = {
  marginBottom: 48,
};
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
};
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
};
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
};

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
};

// const descriptionStyle = {
//   color: "#232129",
//   fontSize: 14,
//   marginTop: 10,
//   marginBottom: 0,
//   lineHeight: 1.25,
// };

// markup
const IndexPage = () => {
  const posts = [
    {
      title: "Page 1",
      uri: "/posts/page-1",
    },
    {
      title: "Page 2",
      uri: "/posts/page-2",
    },
    {
      title: "Page 3",
      uri: "/posts/page-3",
    },
  ];

  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>
        Congratulations
        <br />
        <span style={headingAccentStyles}>— you just made a Gatsby site! </span>
        <span role="img" aria-label="Party popper emojis">
          🎉🎉🎉
        </span>
      </h1>
      <p style={paragraphStyles}>
        Edit <code style={codeStyles}>src/pages/index.js</code> to see this page update in
        real-time.{" "}
        <span role="img" aria-label="Sunglasses smiley emoji">
          😎
        </span>
      </p>
      <ul style={listStyles}>
        {posts.map(({ title, excerpt, uri }) => (
          <li key={uri} style={{ ...listItemStyles }}>
            <span>
              <Link style={linkStyle} to={uri}>
                {title}
              </Link>
            </span>
          </li>
        ))}
      </ul>

      <ul style={listStyles}>
        <li style={{ ...listItemStyles }}>
          <Link to="/app">Client side App</Link>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/imagecdn")}>Image CDN</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/faker/")}>Faker Page</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/api/test")}>API</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/api/test1/thisShouldWork")}>API Splat</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/perm-redirect")}>To permanent Redirect</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/temp-redirect")}>To temp Redirect</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/alt-redirect")}>To alt Redirect</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/example-proxy")}>To rev proxy</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/generated/page-1")}>SSG via create page</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/generated/page-6")}>DSG via create page</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/ssr")}>SSR Page</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/ssrBad")}>Bad SSR Page</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/ssr403")}>Unauthorized SSR Page</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/ssr/43")}>Dynamicly routed SSR page (slug is 43)</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/ssr/42")}>Dynamicly routed SSR page (slug is 42)</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/ssr_splat/test/path")}>Splat routed SSR page</a>
        </li>
        <li style={{ ...listItemStyles }}>
          <a href={withPrefix("/ssr_named_splat/test/path")}>Named Splat routed SSR page</a>
        </li>
      </ul>
    </main>
  );
};

export default IndexPage;
