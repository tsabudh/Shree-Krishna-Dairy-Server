import express from "express";

import cleanCache from "../middlewares/cleanCache";
const router = express.Router();

import * as productController from "../controllers/productController";

import * as customerController from "../controllers/customerController";
import * as authController from "../controllers/authController";
import { validateCustomerDetails } from "../Validations/customerValidator";
import { checkValidationErrors } from '../Validations/checkValidationErrors';
router
  .route("/")
  .get(authController.checkClearance, customerController.getAllCustomers)
  .post(
    authController.checkClearance,
    validateCustomerDetails(false),
    checkValidationErrors,
    cleanCache,
    customerController.addCustomer
  );

router
  .route("/:id")
  .get(authController.checkClearance, customerController.getCustomer)
  .patch(
    authController.checkClearance,
    validateCustomerDetails(true),
    checkValidationErrors,
    cleanCache,
    customerController.updateCustomer
  )
  .delete(
    authController.checkClearance,
    cleanCache,
    customerController.deleteCustomer
  );

export default router;
