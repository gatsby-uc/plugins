import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

export default function PostPage({ title, content }) {
  return (
    <article>
      <Link to="/">Return to Home</Link>

      <h1>{title}</h1>
      <p>{content}</p>
      <StaticImage src="../images/icon.png" />
    </article>
  )
}
