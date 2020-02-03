const superagent = require("superagent");
const db = "http://localhost:1337/token";
const { startServer } = require("../server.js");
var monId; // id of the deleted token
var req1; //first get request
var tokenAdded; //boolean

beforeAll(async () => {
  await startServer({ _db: db });
  await superagent.post("http://localhost:1337/tokens").send("gitlab", "123456789" );
  req1 = await superagent.get("http://localhost:1337/tokens");
  monId = req1.body[0].id;

  tokenAdded = monId !== null; // if the token was posted in the database
});

test("should have delete token in database", async () => {
  if (tokenAdded) {
    // if the token was posted in the database

    console.log("Token successfully added to the database");
    await superagent.delete(`http://localhost:1337/tokens/${monId}`);
    var req2 = await superagent.get(`http://localhost:1337/tokens`);
    await expect(req2.body[0]).toBeUndefined();
  } else {
    console.log("Failed to add the token to the database");
  }
});
