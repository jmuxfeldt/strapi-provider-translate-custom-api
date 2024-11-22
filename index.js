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
          console.log(options);
          // destructuring options
          const { sourceLocale, targetLocale } = options;
          let text = options.text;

          // validation if data exists or not
          if (!text) {
            return [];
          }

          if (!sourceLocale || !targetLocale) {
            throw new Error("source and target locale must be defined");
          }

          // if text is string, convert it to array
          if (typeof text === "string") {
            text = [text];
          }

          const baseURL = apiURL;
          const params = `target=${targetLocale}`;
          const url = `${baseURL}?${params}`;

          // store result
          const translatedTexts = [];

          // loop through these values
          for (const singleText of text) {
            try {
              const response = await fetch(url, {
                method: "POST",
                body: singleText,
              });

              // check if response is ok
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              // return text
              const data = await response.text();
              if (data == "") {
                throw new Error("No translation found");
              }
              translatedTexts.push(data);
            } catch (error) {
              console.error(`Failed to translate: "${singleText}"`);
              console.error(error);
              translatedTexts.push(singleText); // Fallback to original text on failure
            }
          }

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
