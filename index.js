const { fetchTranslation } = require("./apiHandler");

module.exports = {
  provider: "custom-api",
  name: "Custom API Translation Provider",

  /**
   * @param {object} providerOptions all config values in the providerOptions property
   * @param {object} pluginOptions all config values from the plugin
   */

  init(providerOptions = {}, pluginConfig = {}) {
    // Do some setup here
    // todo add and use api key in future
    const { apiURL, apiKey } = providerOptions;

    return {
      /**
       * @param {{
       *  text:string|string[],
       *  sourceLocale: string,
       *  targetLocale: string,
       *  priority: number,
       *  format?: 'plain'|'markdown'|'html'
       * }} options all translate options
       * @returns {string[]} the input text(s) translated
       *
       */

      async translate(options) {
        // Implement translation

        try {
          const { sourceLocale, targetLocale } = options;
          let text = options.text;

          // validation
          if (!text) {
            return [];
          }
          if (typeof text === "string") {
            text = [text];
          }

          // required fields
          if (!sourceLocale || !targetLocale) {
            throw new Error("source and target locale must be defined");
          }

          // collect all promises
          const translationPromises = text.map((singleText) => {
            return fetchTranslation({
              apiURL,
              apiKey,
              text: singleText,
              targetLocale,
              sourceLocale,
            }).catch((error) => {
              console.log(`Failed to translate: "${singleText}"`);
              console.error(error);
              return singleText; // Fallback to original text on failure
            });
          });

          // execute all promises
          const translatedTexts = await Promise.all(translationPromises);
          return translatedTexts;
        } catch (error) {
          throw new Error(`Translation failed: ${error.message}`);
        }
      },

      /**
       * @returns {{count: number, limit: number}} count for the number of characters used, limit for how many can be used in the current period
       */

      async usage() {
        // Implement usage
        // return { count: 0, limit: 100000 };
      },
    };
  },
};
