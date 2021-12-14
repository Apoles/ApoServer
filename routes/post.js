import express from "express";
import { getUser, createUsers, login } from "../controller/login.js";

import auth from "../middlewares/middleAuth.js";

const router = express.Router();

router.get("/", getUser);
//router.post("/", createUsers);
router.post("/", auth);

export default router;
