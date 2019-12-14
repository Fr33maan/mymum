const superagent = require("superagent");
const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp("postgres://postgres:9998@localhost:5432/my_database_test");
const bodyParser = require("body-parser");

beforeAll( () =>{

db.any(`DELETE FROM Token`).then()
db.any(`INSERT INTO Token(Type, Token) VALUES($1,$2)`,  ['digitalocean', 'abc']).then()
db.any(`INSERT INTO Token(Type, Token) VALUES($1,$2)`,  ['azure', 'def']).then()
db.any(`INSERT INTO Token(Type, Token) VALUES($1,$2)`,  ['gitlab', 'ghi']).then()

});

test("On devrait recevoir la liste de tout les tokens", async (req, res) => {
  const result = await (await superagent.get('/token')).body
  expect(result).toEqual([{"token": "abc", "type": "digitalocean"}, {"token": "def", "type": "azure"}, {"token": "ghi", "type": "gitlab"}]); 
})