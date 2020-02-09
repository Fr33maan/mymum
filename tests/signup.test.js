const superagent = require("superagent");
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:9998@localhost:5432/my_database_test");
const { startServer } = require("../server.js");
const { closeServer } = require("../server.js");

// We empty the test database and start the server

beforeAll(async () => {
  startServer({ _db: db });
  await db.any(`TRUNCATE TABLE account RESTART IDENTITY`);
  await superagent.post("http://localhost:8080/account").send({
    email: "mehdi@gmail.com",
    password: "password123",
    username: "webizz"
  });
});

afterAll(() => {
  process.exit(0);
});

test("should receive the account created", async () => {
  const { body } = await superagent.get("http://localhost:8080/account");
  expect(body).toStrictEqual([
    {
      username: "webizz",
      password: "password123",
      id_user: 1,
      email: "mehdi@gmail.com"
    }
  ]);
});
