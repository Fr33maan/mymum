const superagent = require("superagent")
const pgp = require("pg-promise")()
const db = pgp("postgres://postgres:9998@localhost:5432/my_database_test")
const { startServer } = require('../server.js')

// We empty the test database and start the server
beforeAll( async () =>{
  await startServer({ _db: db })
  await db.any(`DELETE FROM account`)
  await db.any(`INSERT INTO account(email, password, username) VALUES($1,$2,$3)`,  ['mehdi.zenasni.pro@gmail.com', 'password1234', 'zenasni'])
  
})

test("should receive the account created", async () => {
  const { body } = await superagent.get('http://localhost:8080/account')
  expect({body}).toContainEqual({"body": [
    {"username" : "zenasni", "password": "password1234", "email": "mehdi.zenasni.pro@gmail.com"}
  ]
})
});
