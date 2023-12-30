import mongoose from "mongoose";

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin";

export const validateAccount = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username });
    if (admin && bcrypt.compareSync(password, admin.password)) {
      res.locals.currentUser = admin.id;
      next();
    } else {
      console.log("account not found/ password incorrect");
      throw new Error("Account not found. Incorrect password or username");
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
  const payload = {
    currentUser: res.locals.currentUser,
    issuedAt: Date.now(),
  };
  let token = jwt.sign(payload, "secretKey", function (error, token) {
    if (error) {
      console.log(error);
    }
    if (token) {
      res.send({
        status: "success",
        token: token,
      });
    }
  });
};

export const checkClearance = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const bearerToken = bearerHeader.split(" ")[1];

    jwt.verify(bearerToken, "secretKey", (error, decodedToken) => {
      if (error) {
        console.log(error);
        res.send({
          status: "failure",
          message: error.message,
        });
        return;
      }
      next();
    });
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
