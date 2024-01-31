import mongoose from "mongoose";

import express from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from 'fs';

import { generateJWKS } from "../utils/jwt";

import Admin from "../models/Admin";
import AppError from "../utils/appError";

export const validateAccount = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username }).select('+password');
    if (admin && bcrypt.compareSync(password, admin.password)) {
      //- Setting up res.locals for loginAdmin middleware
      res.locals.currentUser = admin.id;
      next();
    } else {
      console.log("Account not found. Incorrect password or username.");
      throw new Error("Account not found. Incorrect password or username.");
    }
  } catch (error: any) {
    console.log(error);
    res.send({
      status: "failure",
      message: error.message,
    });
  }
};

export const loginAccount = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {

  try {
    const payload = {
      currentUser: res.locals.currentUser,
      issuedAt: Date.now(),
    };
    // jwt.sign(payload, (process.env.JWT_SECRET_KEY as string), function (error, token) {
    //   if (error) {
    //     console.log(error);
    //   throw new AppError(`Could not create jwt.`, 400)

    //   }
    //   if (token) {

    //     console.log(token);
    //     res.send({
    //       status: "success",
    //       token: token,
    //     });
    //   }
    // });
    const secret = fs.readFileSync('certs/private.pem');

    let token = jwt.sign(payload, secret, { expiresIn: '60min', algorithm: 'RS256' });

    if (!token) throw new AppError('Could not sign token.', 400)
    res.status(200).json({
      status: 'success',
      token
    })


    // console.log(token);


  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      status: 'failure',
      message: error.message
    })
  }

};

export const checkClearance = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const bearerToken = bearerHeader.split(" ")[1];

    // jwt.verify(bearerToken, (process.env.JWT_SECRET_KEY as string), (error, decodedToken) => {
    //   if (error) {
    //     console.log(error);
    //     res.send({
    //       status: "failure",
    //       message: error.message,
    //     });
    //     return;
    //   }
    //   // console.log(JSON.parse(decodedToken))
    //   console.log((decodedToken as JwtPayload).currentUser)
    //   res.locals.currentUser = (decodedToken as JwtPayload).currentUser;
    //   next();
    // });

    // const privatePemFile = 'certs/private.pem';
    const publicPemFile = 'certs/public.pem';


    const jwks = generateJWKS(publicPemFile);
    // console.log(JSON.stringify(jwks, null, 2));

    // res.locals.currentUser = (decodedToken as JwtPayload).currentUser;
    // console.log(res.locals.currentUser);
    next();

    // console.log(jwks)
  } else {
    res.send({
      status: "failure",
      message: "Login first",
    });
  }
};

export const logoutAccount = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.send({
    status: "success",
    token: "Invalid Token",
  });
};
// module.exports = {
//   validateAccount,
//   loginAccount,
//   checkClearance,
//   logoutAccount,
// };
