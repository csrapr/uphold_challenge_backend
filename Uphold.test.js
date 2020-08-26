/**
 * @jest-environment node
 */
//o comentário acima é um fix para um erro de CORS do axios quando se usa o jest

const UpholdApi = require("./Uphold");

test("Fetches USD-BTC ticker from Uphold API and returns an array of length 1", async () => {
  expect.assertions(1);
  const data = await UpholdApi.requestCurrencies("BTC-USD");
  expect(data.length).toBe(1);
});

test("Fetches default currency ticker from Uphold API and returns an array of length 1 or greater", async () => {
  expect.assertions(1);
  const data = await UpholdApi.requestCurrencies("USD");
  expect(data.length).toBeGreaterThanOrEqual(1);
});
