const db = require("../db/db");
const programsTable = "programs";
const escapeQuote = require("../utils/escapeQuote");

async function getPremadePrograms() {
  const authorid = "admin";

  try {
    const data = await db.query(
      `SELECT * FROM ${programsTable} WHERE authorid = '${authorid}';`
    ); // Check if the user already exists in the database
    return data.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCustomPrograms(authorid) {
  try {
    const data = await db.query(
      `SELECT * FROM ${programsTable} WHERE authorid = '${authorid}';`
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
  let { authorid, title, num_weeks, training_goal, routine } = program;
  [title, training_goal] = escapeQuote([title, training_goal]);
  let rightNow = new Date();
  rightNow = rightNow.toISOString();

  try {
    await db.query(`INSERT INTO ${programsTable} (authorid, title, num_weeks, routine, updated, created, training_goal)
    VALUES ('${authorid}', '${title}', '${num_weeks}', '${JSON.stringify(
      routine
    )}', '${rightNow}', '${rightNow}', '${training_goal}')`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateProgramRoutine(program, authorid) {
  let rightNow = new Date();
  rightNow = rightNow.toISOString();

  if (authorid !== program.authorid) {
    throw new Error("Not authorized to update the program");
  } else {
    try {
      await db.query(`
        UPDATE ${programsTable}
        SET routine = '${JSON.stringify(program.routine)}',
            updated = '${rightNow}'
        WHERE id = '${program.id}'
        `);

      program.updated = rightNow;

      return program;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

async function deleteProgram(programId, authorid) {
  if (authorid === "admin") {
    throw new Error("Not authorized to delete the program");
  } else {
    try {
      await db.query(
        `DELETE FROM ${programsTable} WHERE authorid = '${authorid}' AND id = '${programId}'`
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
  getProgram,
  updateProgramRoutine,
  deleteProgram,
};
