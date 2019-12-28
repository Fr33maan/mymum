const superagent = require("superagent")
const pgp = require("pg-promise")()
const db = pgp("postgres://postgres:9998@localhost:5432/my_database_test")
const { startServer } = require('../server.js')

// We empty the test database and start the server
beforeAll( async () =>{
  await db.any(`DELETE FROM token`)
  await db.any(`INSERT INTO token(tokenType, token) VALUES($1,$2)`,  ['digitalocean', 'abc'])
  await db.any(`INSERT INTO token(tokenType, token) VALUES($1,$2)`,  ['azure', 'def'])
  await db.any(`INSERT INTO token(tokenType, token) VALUES($1,$2)`,  ['gitlab', 'ghi'])
  await startServer({ _db: db })
})

test("should receive the list of tokens", async () => {
  const { body } = await superagent.get('http://localhost:8080/tokens')
  expect({body}).toEqual({"body": [
    {"token": "abc", "tokentype": "digitalocean"}, 
    {"token": "def", "tokentype": "azure"}, 
    {"token": "ghi", "tokentype": "gitlab"}
  ]})
});