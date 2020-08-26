const UpholdApi = require("./Uphold");
const Database = require("./Database");

//  IMPORTANT TODO: Não devo usar floating points para trabalhar com dinheiro,
//  mas para este projecto acho que não é necessário usar algo como
//  https://currency.js.org/

//connect to db
//check if there are transactions
//   if no, buy 1 BTC
//   if yes, get latest
//if it's a purchase try to sell
//if it's a sale, try to buy
//log every transaction to DB

const targetProfit = 0.05; //target profit for every sale in percentage/100. For example for a 5% profit target you put 0.05

let sessionProfit = 0;
let targetSale = 0;
let targetPurchase = Infinity;
let tryingToBuy = true;
let latestPurchase = 0;

const purchaseBTC = (price) => {
  console.log(
    `Trying to purchase BTC. Target price: ${targetPurchase}. Current price: ${price}.`
  );
  if (targetPurchase === 0 || price <= targetPurchase) {
    sessionProfit -= price;
    latestPurchase = price;
    targetSale = price * (1 + targetProfit);
    tryingToBuy = false;
    console.log(
      `Purchased. Price: ${latestPurchase}. Target Price: ${targetPurchase}. Current money: ${sessionProfit}`
    );
    Database.addTransaction(price, "purchase");
  }
};

const sellBTC = (price) => {
  console.log(
    `Trying to sell BTC. Target price: ${targetSale}. Purchase price: ${latestPurchase} Current price: ${price}. Profit: ${
      (price / latestPurchase - 1) * 100
    }%`
  );
  if (price >= targetSale) {
    sessionProfit += price;
    tryingToBuy = true;
    targetPurchase = price * (1 - targetProfit);
    console.log(
      `Sold. Price: ${price}. Target Sale Price: ${targetSale}. Profit: ${
        (price / latestPurchase - 1) * 100
      }%. Current money: ${sessionProfit}`
    );
    Database.addTransaction(price, "sale");
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

const setup = async () => {
  let row = await Database.getLatestTransaction();
  if (row.length === 0) {
    return;
  }
  switch (row[0].type) {
    case "sale":
      tryingToBuy = true;
      targetPurchase = (1 - targetProfit) * parseFloat(row[0].bid);
      break;
    case "purchase":
      tryingToBuy = false;
      targetSale = (1 + targetProfit) * parseFloat(row[0].bid);
      latestPurchase = parseFloat(row[0].bid);
      break;
    default:
      return;
  }
};

/***********/
(async () => {
  try {
    await Database.initDB();
    await setup();
  } catch (e) {
    console.log(e);
  }
})();
ticker(5000);
