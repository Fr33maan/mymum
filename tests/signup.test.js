require('iconv-lite/encodings');
const superagent = require("superagent")
const pgp = require("pg-promise")()
const { Pool, Client } = require('pg')
const db = pgp("postgres://postgres:9998@localhost:5432/my_database_test")
const { startServer } = require('../server.js')


var id

// We empty the test database and start the server
beforeAll( async () =>{
  await startServer({ _db: db })
  const req = await superagent.get('http://localhost:8080/account')
  id = req.body[0].id_user + 1;
  await db.any(`DELETE FROM account`)
  await superagent.post('http://localhost:8080/account')
  .send({ email : "mehdi.zenasni.pro@gmail.com", password : "password1234", username : "zenasni" })
  
})

test("should receive the account created", async () => {
  const { body } = await superagent.get('http://localhost:8080/account')
  expect({body}).toEqual({"body": [
    {"username" : "zenasni", "password": "password1234", "id_user" : id, "email": "mehdi.zenasni.pro@gmail.com"}
  ]
})
});
