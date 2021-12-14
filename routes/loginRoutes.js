import express from "express";
import { createTokFromRefTok, getUser, login } from "../controller/login.js";

import auth from "../middlewares/middleAuth.js";

const loginRoute = express.Router();

loginRoute.get("/", getUser);
loginRoute.post("/ref", createTokFromRefTok);
loginRoute.post("/dene", auth, getUser);
loginRoute.post("/", login);

export default loginRoute;
