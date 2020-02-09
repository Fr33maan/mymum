const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:9998@localhost:5432/my_database");
const bodyParser = require("body-parser");
const http = require("http");
var server;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getTokens({ _db }) {
  return _db.any("SELECT * FROM token");
}

function getAccounts({ _db }) {
  return _db.any("SELECT * FROM account");
}

async function insertTokens(type, token, { _db }) {
  try {
    const sql = `INSERT INTO token(type, token) VALUES($1,$2)`;
    const users = await _db.any(sql, [type, token]);
    console.log("Token inséré dans la base de donnée");
  } catch (e) {
    console.log("Erreur :" + e);
  }
}

async function insertAccount(username, password, email, { _db }) {
  try {
    const sql = `INSERT INTO account(email, password, username) VALUES($1,$2,$3)`;
    const users = await _db.any(sql, [email, password, username]);
    console.log("Utilisateur ajouté à la base de donnée");
  } catch (e) {
    console.log("Erreur : " + e);
  }
}

function startServer({ _db }) {
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

  app.post("/tokens", async (req, res) => {
    const type = req.body.type;
    const token = req.body.token;

    if (typeof type === "string" && typeof token === "number") {
      await insertTokens(type, token, { _db });
    } else {
      console.log("Erreur dans les types des données reçu");
    }
    res.send({ status: "success" });
  });

  app.post("/account", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    if (username && password && email) {
      await insertAccount(username, password, email, { _db });
    } else {
      console.log("Utilisateur invalide");
    }

    res.send({ status: "success" });
  });

  server = http.createServer(app).listen(8080);
}

function closeServer() {
  server.close(() => console.log("closing server..."));
}

// async function bootstrap() {
//   await startServer({_db : db});
// }

// bootstrap().then(() => console.log('Running'))

module.exports = {
  startServer,
  getTokens,
  getAccounts,
  insertAccount,
  insertTokens,
  closeServer,
  server
};
