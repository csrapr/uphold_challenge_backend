const { Client } = require("pg");

//TODO move to .env
const credentials = {
  user: "postgres",
  host: "localhost",
  database: "uphold_challenge_cesar",
  password: "root",
  port: 5432,
};

const client = new Client(credentials);

const initDB = async () => {
  client.connect();

  //type será "sale" ou "purchase" dependendo se vendeu ou comprou bitcoin
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    bid VARCHAR NOT NULL,
    type VARCHAR NOT NULL
    );`;
  try {
    await client.query(createTableQuery);
    console.log("Table created, if it did not exist.");
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
};

const newClient = () => {
  return new Client(credentials);
};

//TODO add try catch
/* const queryDB = async (query) => {
  const client = newClient();
  client.connect();
  const res = await client.query(query);
  client.end();
  return res.rows;
}; */

const getLatestTransaction = async () => {
  const text = `select * from transactions order by id desc limit 1;`;
  try {
    const client = newClient();
    client.connect();
    const res = await client.query(text);
    client.end();
    return res.rows;
  } catch (err) {
    console.log(err.stack);
    client.end();
  }
};

const addTransaction = async (price, type) => {
  const text = `
    INSERT INTO transactions (bid, type) VALUES ($1, $2);
  `;
  values = [price, type];

  try {
    const client = newClient();
    client.connect();
    await client.query(text, values);
    console.log(
      `Transaction of price ${price} and type ${type} added do database.`
    );
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.end();
  }
};

module.exports = { initDB, newClient, addTransaction, getLatestTransaction };
