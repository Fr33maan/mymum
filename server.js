const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:9998@localhost:5432/my_database");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function getTokens({ _db }) {
  return _db.any("SELECT * FROM token");
}

function getAccounts({_db}){
  return _db.any("SELECT * FROM account");
}

async function insertTokens(type, token) {  
  try {
    const sql = `INSERT INTO token(type, token) VALUES($1,$2)`;
    const users = await db.any(sql, [type, token]);
         console.log("Token inséré dans la base de donnée");
  } catch (e) {
    console.log("Erreur :" + e);
  }
}

async function insertAccount(username, password, email){
  try{

    const sql = `INSERT INTO account(email, password, username) VALUES($1,$2,$3)`;
    const users = await db.any(sql, [username, password, email]);
      console.log("Utilisateur ajouté à la base de donnée");

  }
  catch(e){
    console.log("Erreur : "+e);
  }
}

async function startServer({ _db = db }) {
  app.get("/tokens", async (req, res, next) => {
    try {
      const tokens = await getTokens({ _db });

      res.send(tokens);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  app.get("/account", async (req, res, next) => {
    try {
      const user = await getAccounts({ _db });
      res.send(user);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  app.post("/tokens", (req, res) => {
    const type = req.body.type;
    const token = req.body.token;

    if (typeof type === "string" && typeof token === "number") {
      insertTokens(type, token);
    } else {
      console.log("Erreur dans les types des données reçu");
    }
  });

  app.post("/account", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    if (username && password && email) {
      insertAccount(username, password, email);
    } else {
      console.log("Utilisateur invalide");
    }
  });

  app.listen(8080);
}

module.exports = {
  startServer,
  getTokens,
  getAccounts
};
