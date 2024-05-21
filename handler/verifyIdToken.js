const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

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

module.exports = verifyIdToken;
