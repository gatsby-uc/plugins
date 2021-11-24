import React from "react";
import { withPrefix } from "gatsby";

exports.onRenderBody = ({ setPreBodyComponents }, pluginOptions) => {
  const { project, position } = pluginOptions;

  var baseImgStyle = {
    position: `absolute`,
    top: 0,
    border: 0,
  };
  var imgStyle;

  if (position === `right`) {
    imgStyle = {
      ...baseImgStyle,
      right: 0,
    };
  } else {
    imgStyle = {
      ...baseImgStyle,
      left: 0,
    };
  }

  setPreBodyComponents([
    <header key={`gatsby-plugin-github-ribbon-header`}>
      <a href={project} rel={`noopener`} target={`_blank`}>
        <img style={imgStyle} src={withPrefix(`/github_ribbon.png`)} alt="Fork me on GitHub"></img>
      </a>
    </header>,
  ]);
};
