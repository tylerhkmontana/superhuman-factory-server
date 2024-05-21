const db = require("../db/db");

async function getUser(sub) {
  try {
    const data = await db.query(
      `SELECT * FROM users_test WHERE sub = '${sub}';`
    ); // Check if the user already exists in the database
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
  getUser,
};
