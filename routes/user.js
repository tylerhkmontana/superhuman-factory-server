const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUser, registerUser } = require('../models/User.model');
const verifyIdToken = require('../handler/verifyIdToken');

router.post('/login', async (req, res) => {
  const { user, token } = req.body;
  const { email, sub } = user;

  // Validate Google OAuth Token
  try {
    const verifiedSub = await verifyIdToken(token);
    if (verifiedSub !== sub) {
      return res.status(403).send('Invalid Token');
    }
  } catch (err) {
    console.log(err);
    return res.status(403).send('Invalid Token');
  }

  try {
    const data = await getUser(sub);
    if (data.rows.length > 0) {
      const user = data.rows[0];
      // sign in user
      if (user.email === email) {
        const token = jwt.sign({ data: user }, process.env.TOKEN_SECRET, {
          expiresIn: '7d',
        });
        return res.json({
          message: 'succefully logged in',
          user: {
            ...user,
            token,
          },
          registered: true,
        });
      } else {
        // User email does not match with OAuth 'sub'
        return res.status(401).send('Unauthorized User');
      }
    } else {
      // Re-direct user to register page
      const registeringToken = jwt.sign(
        { data: { registering: true } },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '10m',
        }
      );
      return res.json({
        message: 'need to register the user',
        user: {
          ...user,
          registeringToken,
        },
        registered: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Failed to login');
  }
});

// Register User
router.post('/register', async (req, res) => {
  const { user, registeringToken } = req.body;

  const decoded = jwt.verify(registeringToken, process.env.TOKEN_SECRET);

  if (decoded.data.registering) {
    try {
      await registerUser(user);

      const token = jwt.sign({ data: user }, process.env.TOKEN_SECRET, {
        expiresIn: '7d',
      });
      return res.json({
        message: 'succefully logged in',
        user: {
          ...user,
          token,
        },
        registered: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send('Failed to register');
    }
  } else {
    return res.status(403).send('Invalid Registering Token');
  }
});

// Update User
router.put('/updatePr', async (req, res) => {
  const { newPr, user } = req.body;

  try {
    await pool.query(`
          UPDATE users SET pr = '${JSON.stringify(newPr)}' WHERE email = '${
      user.email
    }'
      `);

    res.send('User PR successfully updated');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to update the PR');
  }
});

module.exports = router;
