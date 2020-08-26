const { Client } = require("pg");

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

const queryDB = async (query) => {
  const client = newClient();
  client.connect();
  const res = await client.query(query);
  client.end();
  return res.rows;
};

const addTransaction = async (price, type) => {
  const query = `
    INSERT INTO transactions (bid, type) VALUES (${price + ""}, ${type});
  `;
  const client = newClient();
  client.connect();
  const res = await client.query(query);
  client.end();
};

module.exports = { initDB, newClient, queryDB };
