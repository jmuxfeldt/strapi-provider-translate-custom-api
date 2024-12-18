const translationProvider = require("./index");

// Mocking the API behavior without using fetchTranslation
(async () => {
  // Initialize the provider
  const providerOptions = {
    // apiURL: "https://dummy-html",
    // apiKey: "test-api-key",
  };
  const pluginConfig = {};

  const provider = translationProvider.init(providerOptions, pluginConfig);

  // Test the translate function
  try {
    const translatedTexts = await provider.translate({
      text: "<div>Hello, <b>world</b>!</div>",
      sourceLocale: "en",
      targetLocale: "es-419",
    });

    console.log("Translation Result:", translatedTexts);
  } catch (error) {
    console.error("Error during translation:", error.message);
  }
})();
