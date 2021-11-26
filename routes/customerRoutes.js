import express from "express";
import {
  createCustomer,
  getCustomer,
} from "../controller/customerController.js";

const customerRouter = express.Router();

customerRouter.get("/", getCustomer);
//router.post("/", createUsers);
customerRouter.post("/", createCustomer);

export default customerRouter;
