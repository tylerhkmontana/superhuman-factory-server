const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUser, registerUser, updateUser } = require("../models/User.model");
const { verifyIdToken, authorization } = require("../handler/authHandler");

router.post("/login", async (req, res) => {
  const { user, token } = req.body;
  const { sub } = user;

  // Validate Google OAuth Token
  try {
    const verifiedSub = await verifyIdToken(token);
    if (verifiedSub !== sub) {
      return res.status(403).send("Invalid Token");
    }
  } catch (err) {
    console.log(err);
    return res.status(403).send("Invalid Token");
  }

  try {
    const data = await getUser(sub);
    if (data.rows.length > 0) {
      const user = data.rows[0];
      // sign in user
      if (user.sub === sub) {
        const token = jwt.sign({ data: user }, process.env.TOKEN_SECRET, {
          expiresIn: "7d",
        });
        return res.json({
          message: "succefully logged in",
          user: {
            ...user,
            token,
          },
          registered: true,
        });
      } else {
        // User email does not match with OAuth 'sub'
        return res.status(401).send("Unauthorized User");
      }
    } else {
      // Re-direct user to register page
      const registeringToken = jwt.sign(
        { data: { registering: true } },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );
      return res.json({
        message: "need to register the user",
        user: {
          ...user,
          registeringToken,
        },
        registered: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to login");
  }
});

// Register User
router.post("/register", async (req, res) => {
  const { user, registeringToken } = req.body;

  const decoded = jwt.verify(registeringToken, process.env.TOKEN_SECRET);

  if (decoded.data.registering) {
    try {
      await registerUser(user);

      const token = jwt.sign({ data: user }, process.env.TOKEN_SECRET, {
        expiresIn: "7d",
      });
      return res.json({
        message: "succefully registered in",
        user: {
          ...user,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Failed to register");
    }
  } else {
    return res.status(403).send("Invalid Registering Token");
  }
});

// Update User
router.put("/update", authorization, async (req, res) => {
  const { newProfile, user } = req.body;
  const updatedWhen = Date.now() - new Date(newProfile.updated).getTime();
  const twentyFourHours = 8.64e7;

  if (updatedWhen < twentyFourHours) {
    return res.status(500).send("Already updated within 24 hours.");
  } else if (newProfile.sub !== user.sub) {
    return res.status(500).send("Unauthorized User.");
  } else {
    try {
      await updateUser(newProfile);

      const token = jwt.sign({ data: newProfile }, process.env.TOKEN_SECRET, {
        expiresIn: "7d",
      });
      return res.json({
        message: "succefully updated",
        user: {
          ...newProfile,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Failed to update the user");
    }
  }
});

module.exports = router;
