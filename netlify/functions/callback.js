// Decap CMS GitHub OAuth — step 2: exchange code for token, hand back to CMS
const CLIENT_ID = process.env.OAUTH_CLIENT_ID || "Ov23ctog9bZzAlaTBapb";
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

exports.handler = async (event) => {
  const code = event.queryStringParameters && event.queryStringParameters.code;
  if (!code) return { statusCode: 400, body: "Missing code" };

  let message;
  try {
    const resp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });
    const data = await resp.json();
    if (data.access_token) {
      message =
        "authorization:github:success:" +
        JSON.stringify({ token: data.access_token, provider: "github" });
    } else {
      message = "authorization:github:error:" + JSON.stringify(data);
    }
  } catch (err) {
    message = "authorization:github:error:" + JSON.stringify({ message: String(err) });
  }

  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>' +
    "(function(){function rcv(e){window.opener.postMessage(" +
    JSON.stringify(message) +
    ", e.origin);window.removeEventListener('message',rcv,false);}" +
    "window.addEventListener('message',rcv,false);" +
    "window.opener.postMessage('authorizing:github','*');})();" +
    "</script></body></html>";

  return { statusCode: 200, headers: { "Content-Type": "text/html" }, body: html };
};
