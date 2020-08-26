const axios = require("axios");

const requestCurrencies = async (currency = "BTC-USD") => {
  //GET https://api.uphold.com/v0/ticker/:currency
  try {
    const response = await axios.get(
      `https://api.uphold.com/v0/ticker/${currency}`
    );
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [response.data];
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = { requestCurrencies };
