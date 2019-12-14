const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:9998@localhost:5432/my_database");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getTokens({ _db }) {
  return _db.any("SELECT * FROM Token")
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

async function startServer ({ _db = db }) {
  app.get("/tokens", async (req, res, next)=> {
    try {
      var tokens = await getTokens({ _db })
      console.log(tokens)
      res.send(tokens)
    } catch (e) {
      console.error(e)
      next(e)
    }
  })

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
}



module.exports = {
  startServer,
  getTokens
}
