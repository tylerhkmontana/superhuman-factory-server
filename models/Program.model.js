const db = require("../db/db");
const programsTable = "programs";
const escapeQuote = require("../utils/escapeQuote");

async function getPremadePrograms() {
  const authorId = "admin";

  try {
    const data = await db.query(
      `SELECT * FROM ${programsTable} WHERE authorId = '${authorId}';`
    ); // Check if the user already exists in the database
    return data.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createProgram(program) {
  let { authorId, title, num_weeks, training_goal } = program;
  [title, training_goal] = escapeQuote([title, training_goal]);
  let rightNow = new Date();
  rightNow = rightNow.toISOString();

  try {
    await db.query(`INSERT INTO ${programsTable} (authorId, title, num_weeks, routine, updated, created, training_goal)
    VALUES ('${authorId}', '${title}', '${num_weeks}', '{}', '${rightNow}', '${rightNow}', '${training_goal}')`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCustomPrograms(authorId) {
  console.log(authorId);
  try {
    const data = await db.query(
      `SELECT * FROM ${programsTable} WHERE authorId = '${authorId}';`
    );

    console.log(data);
    return data.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { getPremadePrograms, createProgram, getCustomPrograms };
