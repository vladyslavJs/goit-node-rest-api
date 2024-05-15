import express from "express";


import { register, login, logout, current } from "../controllers/userControllers.js";
import { autMiddleware } from "../helpers/authMiddleware.js";
import { validateBody } from "../helpers/validateBody.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", validateBody, jsonParser, register);
usersRouter.post("/login", validateBody, jsonParser, login);
usersRouter.post("/logout", autMiddleware, jsonParser, logout);
usersRouter.post("/current", current);


export default usersRouter;