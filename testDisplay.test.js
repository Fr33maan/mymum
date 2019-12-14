const superagent = require("superagent")
const pgp = require("pg-promise")()
const db = pgp("postgres://postgres:9998@localhost:5432/my_database_test")
// TODO import the server from server.js file

// We empty the test database
// TODO - start the server
beforeAll( async () =>{
  await db.any(`DELETE FROM Token`)
  await db.any(`INSERT INTO Token(Type, Token) VALUES($1,$2)`,  ['digitalocean', 'abc'])
  await db.any(`INSERT INTO Token(Type, Token) VALUES($1,$2)`,  ['azure', 'def'])
  await db.any(`INSERT INTO Token(Type, Token) VALUES($1,$2)`,  ['gitlab', 'ghi'])
})

test("should receive the list of tokens", async () => {
  const { body } = await superagent.get('/tokens')
  expect(result).toEqual([
    {"token": "abc", "type": "digitalocean"}, 
    {"token": "def", "type": "azure"}, 
    {"token": "ghi", "type": "gitlab"}
  ])
})
