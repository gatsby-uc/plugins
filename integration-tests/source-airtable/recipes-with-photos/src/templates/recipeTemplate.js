import React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../components/layout.js";

class SimpleRecipe extends React.Component {
  render() {
    let recipe = this.props.data.airtable;

    return (
      <Layout>
        <div className="section">
          <div className="columns is-centered">
            <div className="column is-half">
              <nav className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/recipes/">Recipes</Link>
                  </li>
                  <li className="is-active">{recipe.data.Name}</li>
                </ul>
              </nav>
              <div className="card">
                {recipe.data.Attachments && recipe.data.Attachments.localFiles !== 0 ? (
                  <div className="card-image">
                    <figure className="image">
                      <GatsbyImage
                        image={
                          recipe.data.Attachments.localFiles[0].childImageSharp.gatsbyImageData
                        }
                        alt="Recipe"
                      />
                    </figure>
                  </div>
                ) : (
                  <div className="card-image">
                    <figure className="image is-3by2">
                      <img alt="Recipe" src={this.props.data.placeholder.publicURL} />
                    </figure>
                  </div>
                )}
                <div className="card-content">
                  <h2 className="title has-text-centered">{recipe.data.Name}</h2>
                  <div className="level">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Rating</p>
                        <p className="">
                          {checkBlank(recipe.data.Rating)}
                          {`\u2606`}
                          /10
                        </p>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Last Made</p>
                        <p className="">{checkBlank(recipe.data.Last_Made)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="level">
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Prep Time</p>
                        <p className="">{`Prep: ${checkBlankTime(
                          recipe.data.Preparation_Time,
                        )}`}</p>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Cook Time</p>
                        <p className="">{`Cooking: ${checkBlankTime(recipe.data.Cooking_Time)}`}</p>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <p className="heading">Total Time</p>
                        <p className="">{`Total: ${checkBlankTime(recipe.data.Total_Time)}`}</p>
                      </div>
                    </div>
                  </div>
                  <div className="content">
                    <h2 className="title">Ingredients</h2>
                    <div>
                      <ul>
                        {recipe.data.Ingredients.split(`\n`).map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <h2 className="title">Directions</h2>
                    {recipe.data.Directions.split(`\n`).map((direction, index) => (
                      <p key={index}>{direction}</p>
                    ))}
                  </div>
                </div>
                {recipe.data.URL ? (
                  <footer className="card-footer">
                    <a
                      href={recipe.data.URL}
                      className="card-footer-item"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Recipe Link
                    </a>
                  </footer>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default SimpleRecipe;

export const pageQuery = graphql`
  query SimpleRecipeBySlug($name: String!) {
    airtable(table: { eq: "Recipes" }, data: { Name: { eq: $name } }) {
      id
      data {
        Name
        Directions
        URL
        Cooking_Time
        Preparation_Time
        Total_Time
        Last_Made
        Rating
        Ingredients
        Attachments {
          localFiles {
            childImageSharp {
              gatsbyImageData(width: 256, placeholder: TRACED_SVG, layout: CONSTRAINED)
            }
          }
        }
      }
    }
    placeholder: file(relativePath: { eq: "placeholder.png" }) {
      publicURL
    }
  }
`;

let checkBlank = (value) => (value ? value : `--`);
let checkBlankTime = (value) => (value ? `${value}m` : `--`);
