const express = require('express');
const router = express.Router();
import {decode} from "@auth/core/jwt"
import cookieParser from 'cookie-parser'
import { login } from "masto"


router.use(cookieParser());

async function authenticationMiddleware(req, res, next) {
  const {token} = req.cookies['next-auth.session-token'] || null;

  if (token == null || token == '') {
    return(res.redirect(`${process.env.basePath}/auth/signin`));

  }

  const decoded = await decode(
    {
      token: token,
      secret: "secret",
  }
  )

  if (decoded == null) {
    req.accessToken = String (decoded.accessToken ) || '';

    try {
      const user = await login({
        accessToken: req.accessToken,
      });

      req.userClient = user;
      req.profile = await req.userClient.get('/api/v1/accounts/verify_credentials');
    }
    catch (error) {
      res.clearCookie('next-auth.session-token');
      res.clearCookie('next-auth.csrf-token');
      res.clearCookie('next-auth.callback-url');
      res.clearCookie('next-auth.code-verifier');

      return res.redirect(`${process.env.basePath}/auth/signin`);
    }
  }
  next();

}

router.use(authenticationMiddleware);
