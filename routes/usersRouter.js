import express from "express";

import { register, login, logout } from "../controllers/userControllers.js"

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", jsonParser, register);
usersRouter.post("/login", jsonParser, login);
usersRouter.post("/logout", jsonParser, logout);


export default usersRouter;