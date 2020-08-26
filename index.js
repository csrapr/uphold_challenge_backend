const UpholdApi = require("./Uphold");
const Database = require("./Database");

//connect to db
//check if there are transactions
//   if no, buy 1 BTC
//   if yes, get latest
//if it's a purchase try to sell
//if it's a sale, try to buy
//log every transaction to DB

Database.initDB();

let profit = 0;
let targetSale = 0;
let targetPurchase = 0;
let tryingToBuy = true;
let latestPurchase = 0;

const purchaseBTC = (price) => {
  console.log(
    `Trying to purchase BTC. Target price: ${targetPurchase}. Current price: ${price}.`
  );
  if (targetPurchase === 0 || price <= targetPurchase) {
    profit -= price;
    latestPurchase = price;
    targetSale = price * 1.00000005;
    tryingToBuy = false;
    console.log(
      `Purchased. Price: ${latestPurchase}. Target Price: ${targetPurchase}. Current money: ${profit}`
    );
  }
};

const sellBTC = (price) => {
  console.log(
    `Trying to sell BTC. Target price: ${targetSale}. Purchase price: ${latestPurchase} Current price: ${price}. Profit: ${
      (price / latestPurchase - 1) * 100
    }%`
  );
  if (price >= targetSale) {
    profit += price;
    tryingToBuy = true;
    targetPurchase = 0.99999995 * price;
    console.log(
      `Sold. Price: ${price}. Target Sale Price: ${targetSale}. Profit: ${
        (price / latestPurchase - 1) * 100
      }%. Current money: ${profit}`
    );
  }
};

const ticker = (interval = 1000) => {
  setInterval(async () => {
    const data = await UpholdApi.requestCurrencies("BTC-USD");
    if (tryingToBuy) {
      purchaseBTC(parseFloat(data[0].bid));
    } else {
      sellBTC(parseFloat(data[0].bid));
    }
  }, interval);
};

ticker(5000);
