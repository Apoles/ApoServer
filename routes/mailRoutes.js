import express from "express";
import { helloMail, sendMail } from "../controller/mailController.js";
const mailRoute = express.Router();

mailRoute.post("/", sendMail);
mailRoute.get("/", helloMail);

export default mailRoute;
