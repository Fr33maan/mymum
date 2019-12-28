const superagent = require("superagent");
const db = "http://localhost:1337/token";
const { startServer } = require("../server.js");

// We empty the test database and start the server
beforeAll(async () => {
  await superagent.delete("http://localhost:1337/tokens") // I try to delete all tokens
  await superagent.post("http://localhost:1337/tokens").send({"token_type": "gitlab", "token": "123456789",}) //I add one token
  await startServer({ _db: db });
});

test("should receive the list of tokens", async () => {
  const { body } = await superagent.get("http://localhost:1337/tokens");
  expect({ body }).toEqual({"body": [{"token_type": "gitlab","token": "123456789",}]});
});
