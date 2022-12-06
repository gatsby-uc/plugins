const injectPinterestScript = ({ saveButton = false }) => {
  const addJS = () => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://assets.pinterest.com/js/pinit.js";

    if (Boolean(saveButton)) {
      script.dataset.pinHover = "true";

      const { round = false, tall = true } = typeof saveButton === "boolean" ? {} : saveButton;
      if (round) {
        script.dataset.pinRound = "true";
      }

      if (tall) {
        script.dataset.pinTall = "true";
      }
    }

    document.querySelectorAll("body")[0].append(script);
  };

  addJS();
};

let injectedPinterestScript = false;

export const onRouteUpdate = (arguments_, pluginOptions = {}) => {
  const hover = Boolean(pluginOptions.saveButton);

  const querySelectors = ["[data-pin-do]", hover ? "img" : ""].filter(Boolean).join(",");

  if (document.querySelector(querySelectors) !== null) {
    if (!injectedPinterestScript) {
      injectPinterestScript(pluginOptions);

      injectedPinterestScript = true;
    }

    if (!hover && typeof PinUtils !== `undefined` && typeof window.PinUtils.build === `function`) {
      window.PinUtils.build();
    }
  }
};
