import express from 'express';
import { Auth } from '@auth/core';
import {mastodon} from 'masto';

const baseUrl= "http://localhost:3000";

console.log(baseUrl);

const getMastodonConfig = async(serverBaseUrl, callbackBaseUrl) =>{

  const serverCredentials = await fetch(baseUrl + "/api/v1/apps", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "client_name": "authjsplaying",
          "redirect_uris": callbackBaseUrl + "/api/auth/callback/mastodon"
      })
  });
  const data = await serverCredentials.json();

  const config = {
      providers: [{
          id: "mastodon",
          name: "Mastodon",
          type: "oauth",
          authorization: {
              url: serverBaseUrl + "/oauth/authorize",
              params: {
                  'response_type': 'code',
                  'redirect_uri': callbackBaseUrl + "/api/auth/callback/mastodon",
                  'scope': 'read'
              }
          },
          token: serverBaseUrl + "/oauth/token",
          clientId: data.client_id,
          clientSecret: data.client_secret,
          userinfo: serverBaseUrl + "/api/v1/accounts/verify_credentials",
          profile: (data) => {
              return {
                  id: data.id,
              }
          }
      }],
      callbacks: {
          async jwt({ token, user, account, profile, isNewUser }) {
              token.access_token = account?.access_token
              token.profile = profile
              return token
          }
      },
      skipCSRFCheck: skipCSRFCheck,
      trustHost: true,
      secret: "secret",
  };

  return config;
}


const config = getMastodonConfig("https://mastodon.social", baseUrl);
const router = express.Router();

//trying to follow https://medium.com/@jibla/auth-js-exploration-1b6c27cf076f tutorial (escribir en notion)

router.get('/', async(req, res) => {

  // Converting Express req headers to Fetch API headers

  const headers = new Headers();
  for ( const headerName in req.headers) {
    const headerValue = req.headers[headerName]?.toString() ?? '';
    if (Array.isArray(headerValue)) {
      for (const value of headerValue) {
        headers.append(headerName, value);
      }
    }
    else {
      headers.append(headerName, headerValue);
    }
  }

  // Creating fetch API's Request Object from Express req object

  const request = new Request(`http://localhost:3000${req.url}`, {
    method: req.method,
    headers,
    body: req.body,
  });

  // Main Auth.js function
  const response = await Auth(request, config);

  // Converting Fetch API response to Express res object
  res.status(response.status);
  res.contentType(response.headers.get('content-type') ?? 'text/plain');
  res.headers.forEach((value, key) => {
    if (value) {
      res.setHeader(key, value);
    }
  });

  const body = await response.text();
  res.send(body);

    res.send('Hello World!');
}

)

export default router;
