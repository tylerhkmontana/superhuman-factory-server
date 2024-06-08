const db = require("../db/db");
const programsTable = "programs";

async function getPremadePrograms() {
  const authorId = "admin";

  try {
    const data = await db.query(
      `SELECT * FROM ${programsTable} WHERE authorId = '${authorId}';`
    ); // Check if the user already exists in the database
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { getPremadePrograms };
