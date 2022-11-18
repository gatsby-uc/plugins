import React from "react";
import { withPrefix } from "gatsby";

export const onRenderBody = ({ setPreBodyComponents }, pluginOptions) => {
  const { project, position } = pluginOptions;

  const baseImgStyle = {
    position: `absolute`,
    top: 0,
    border: 0,
  };

  position === `right` ? (baseImgStyle["right"] = 0) : (baseImgStyle["left"] = 0);

  setPreBodyComponents([
    <header key={`gatsby-plugin-github-ribbon-header`}>
      <a href={project} rel={`noopener`} target={`_blank`}>
        <img
          style={baseImgStyle}
          src={withPrefix(`/github_ribbon.png`)}
          alt="Fork me on GitHub"
        ></img>
      </a>
    </header>,
  ]);
};
