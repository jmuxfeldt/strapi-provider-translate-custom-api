import isHtml from "is-html";

const fetchTranslation = async ({
  apiURL,
  apiKey,
  text,
  targetLocale,
  sourceLocale,
}) => {
  if (!apiURL || !text || !targetLocale) {
    throw new Error("API URL, text, and target locale must be provided");
  }

  let url = `${apiURL}?target=${targetLocale}&source=${sourceLocale}`;

  if (apiKey) {
    url += `&apiKey=${apiKey}`;
  }

  if (isHtml(text)) {
    url += "&format=html";
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: text,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text();

    if (!data) {
      throw new Error("No translation found");
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch translation for: "${text}"`);
    console.error(error);
    return text; // Fallback to original text on failure
  }
};

module.exports = { fetchTranslation };
