const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
require("dotenv").config();

const bodyParser = require("body-parser");
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/getUsers", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.json(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to retrieve users");
  }
});

app.post("/api/newUser", async (req, res) => {
  const { email, givenName, familyName, pr } = req.body;

  try {
    const data = await pool.query(
      `SELECT * FROM users WHERE email = '${email}';`
    );
    if (data.rows.length > 0) {
      res.status(400).send("The user already exists");
    } else {
      const joined = new Date().toISOString();
      console.log(pr);
      await pool.query(
        `INSERT INTO users (email, family_name, given_name, joined, pr) 
        VALUES ('${email}', '${familyName}', '${givenName}', '${joined}', '${JSON.stringify(
          pr
        )}')`
      );
      res.send("New user was successfully added.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to add new User");
  }
});

app.listen(port, () => console.log(`server running on port:${port}`));
