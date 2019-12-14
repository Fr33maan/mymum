const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp("postgres://postgres:9998@localhost:5432/my_database_test");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function displayTokens() {
  try {
    const tokens = await db.any("SELECT * FROM Token");
    console.log(tokens);
    return tokens;
  } catch (e) {
    console.log(e);
    return e;
  }
}

app.get("/token", async (req, res) =>{
  var lesTokens = await displayTokens();
  res.send(lesTokens);
});

app.listen(8080);
