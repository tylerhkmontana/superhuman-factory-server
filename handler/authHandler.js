const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const jwt = require("jsonwebtoken");

async function verifyIdToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:
      "860213078608-0cg8fgqvsu3bqjbclvmvofm2lv1bbi8d.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  return payload["sub"];
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];
}

function authorization(req, res, next) {
  const { user } = req.body;

  // Check if the token is valid
  try {
    const decoded = jwt.verify(user.token, process.env.TOKEN_SECRET);
    if (decoded.data.sub === user.sub) {
      next();
    } else {
      res.status(403).send("Unauthorized access");
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send("Invalid Token");
  }

  // Match token id and updating user id
}

module.exports = { verifyIdToken, authorization };
