const db = require('../db/db');

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

async function registerUser(user) {
  const {
    sub,
    email,
    given_name,
    family_name,
    gender,
    weight,
    dob,
    pr,
    joined,
    updated,
  } = user;
  try {
    const data = await db.query(
      `SELECT * FROM users_test WHERE sub = '${sub}';`
    ); // Check if the user already exists in the database
    if (data.rows.length > 0) {
      console.log('User Already Exists');
    } else {
      await db.query(
        `INSERT INTO users_test (sub, email, family_name, given_name, gender, weight, dob, pr, joined, updated) 
          VALUES ('${sub}', '${email}', '${family_name}', '${given_name}', '${gender}', '${weight}', '${dob}', '${JSON.stringify(
          pr
        )}','${joined}', '${updated}')`
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUser,
  registerUser,
};
