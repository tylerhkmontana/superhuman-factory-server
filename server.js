const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

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

// Register New User
app.post("/api/user/newUser", async (req, res) => {
  const { email, given_name, family_name } = req.body;

  try {
    const data = await pool.query(
      `SELECT * FROM users WHERE email = '${email}';`
    ); // Check if the user already exists in the database
    if (data.rows.length > 0) {
      console.log("user exists");
      res.send("The user already exists");
    } else {
      const joined = new Date().toISOString();
      await pool.query(
        `INSERT INTO users (email, family_name, given_name, joined) 
        VALUES ('${email}', '${family_name}', '${given_name}', '${joined}')`
      );
      res.send("New user was successfully added.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to add new User");
  }
});

app.put("/api/user/updatePr", async (req, res) => {
  const { newPr, user } = req.body;

  try {
    await pool.query(`
        UPDATE users SET pr = '${JSON.stringify(newPr)}' WHERE email = '${
      user.email
    }'
    `);

    res.send("User PR successfully updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to update the PR");
  }
});

app.listen(port, () => console.log(`server running on port:${port}`));
