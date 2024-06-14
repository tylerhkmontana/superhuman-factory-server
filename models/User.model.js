const db = require("../db/db");
const usersTable = "users";
const escapeQuote = require("../utils/escapeQuote");

async function getUser(sub) {
  try {
    const data = await db.query(
      `SELECT * FROM ${usersTable} WHERE sub = '${sub}';`
    ); // Check if the user already exists in the database
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function registerUser(user) {
  let { sub, email, given_name, family_name, gender, weight, dob, pr, joined } =
    user;

  [given_name, family_name] = escapeQuote([given_name, family_name]);

  try {
    const data = await db.query(
      `SELECT * FROM ${usersTable} WHERE sub = '${sub}';`
    ); // Check if the user already exists in the database
    if (data.rows.length > 0) {
      throw new Error("User already exists.");
    } else {
      await db.query(
        `INSERT INTO ${usersTable} (sub, email, family_name, given_name, gender, weight, dob, pr, joined, updated) 
          VALUES ('${sub}', '${email}', '${family_name}', '${given_name}', '${gender}', '${weight}', '${dob}', '${JSON.stringify(
          pr
        )}','${joined}', '${updated}')`
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function updateUser(newProfile) {
  let { sub, given_name, family_name, gender, weight, dob, pr, updated } =
    newProfile;

  [given_name, family_name] = escapeQuote([given_name, family_name]);

  try {
    await db.query(`
    UPDATE ${usersTable} SET given_name = '${given_name}', family_name = '${family_name}', gender = '${gender}', weight = '${weight}', dob = '${dob}' ,pr = '${JSON.stringify(
      pr
    )}', updated = '${updated}' WHERE sub = '${sub}'`);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = {
  getUser,
  registerUser,
  updateUser,
};
