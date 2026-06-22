// Decap CMS GitHub OAuth — step 1: redirect to GitHub authorize
const CLIENT_ID = process.env.OAUTH_CLIENT_ID || "Ov23ctog9bZzAlaTBapb";

exports.handler = async (event) => {
  const host = event.headers.host;
  const redirectUri = `https://${host}/.netlify/functions/callback`;
  const url =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    "&scope=repo,user" +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return { statusCode: 302, headers: { Location: url }, body: "" };
};
