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

async function getCustomPrograms(authorId) {
  try {
    const data = await db.query(
      `SELECT * FROM ${programsTable} WHERE authorId = '${authorId}';`
    );

    return data.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getProgram(programId) {
  try {
    const data = await db.query(
      `SELECT * FROM ${programsTable} WHERE id = '${programId}' LIMIT 1`
    );

    return data.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createProgram(program) {
  let { authorId, title, num_weeks, training_goal, routine } = program;
  [title, training_goal] = escapeQuote([title, training_goal]);
  let rightNow = new Date();
  rightNow = rightNow.toISOString();

  try {
    await db.query(`INSERT INTO ${programsTable} (authorId, title, num_weeks, routine, updated, created, training_goal)
    VALUES ('${authorId}', '${title}', '${num_weeks}', '${JSON.stringify(
      routine
    )}', '${rightNow}', '${rightNow}', '${training_goal}')`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteProgram(programId, authorId) {
  if (authorId === "admin") {
    throw new Error("Not authorized to delete the program");
  } else {
    try {
      await db.query(
        `DELETE FROM ${programsTable} WHERE authorId = '${authorId}' AND id = '${programId}'`
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = {
  getPremadePrograms,
  createProgram,
  getCustomPrograms,
  deleteProgram,
  getProgram,
};
