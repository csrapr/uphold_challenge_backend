const axios = require("axios");

//rascunho, mover isto para index.js talvez?
const ticker = (interval = 1000) => {
  setInterval(async () => {
    const data = await requestCurrencies();
    console.log(data[0]);
  }, interval);
};

const requestCurrencies = async (currency = "BTC-USD") => {
  //GET https://api.uphold.com/v0/ticker/:currency
  const response = await axios.get(
    `https://api.uphold.com/v0/ticker/${currency}`
  );
  return response.data;
};

module.exports = { ticker, requestCurrencies };
