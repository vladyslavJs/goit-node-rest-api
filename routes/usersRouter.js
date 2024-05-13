import express from "express";

import { register, login } from "../controllers/userControllers.js"

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", jsonParser, register);
usersRouter.post("/login", jsonParser, login);


export default usersRouter;