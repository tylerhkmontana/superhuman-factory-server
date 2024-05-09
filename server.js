const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/newUser", async (req, res) => {
  console.log(process.env.DATABASE_URL);
  console.log("Testing");
  try {
    const createTable = await pool.query(
      "CREATE TABLE IF NOT EXISTS users(userId INT PRIMARY KEY, email VARCHAR NOT NULL, family_name VARCHAR, given_name VARCHAR, joined DATE NOT NULL)"
    );
    console.log(createTable);
    res.send("Table created");
  } catch (error) {
    // console.log(error);
    res.status(500).send("Failed to create table");
  }
});

app.listen(port, () => console.log(`server running on port:${port}`));
