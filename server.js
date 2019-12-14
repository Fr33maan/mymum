const express = require("express");
const pgp = require("pg-promise")();
const superagent = require("superagent");
const app = express();
const db = pgp("postgres://postgres:9998@localhost:5432/my_database");
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

async function insertTokens(type, token) {
  try {
    const sql = `INSERT INTO Token(Type, Token) VALUES($1,$2)`;
    const users = await db.any(sql, [type, token]);
    console.log("Token inséré dans la base de donnée");
  } catch (e) {
    console.log("Erreur :" + e);
  }
}

app.get("/token", async (req, res)=> {
  var lesTokens = await displayTokens();
  res.send(lesTokens);
});

app.post("/tokens", (req, res) => {
  res.send(req.body);

  console.log("Voici la requête obtenue : " + JSON.stringify(req.body));
  const type = req.body.type;
  const token = req.body.token;

  if (typeof type === "string" && typeof token === "number") {
    insertTokens(type, token);
  } else {
    console.log("Erreur dans les types des données reçu");
  }
});

app.listen(8080);
