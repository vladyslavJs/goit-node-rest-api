import express from "express";


import { register, login, logout, current } from "../controllers/userControllers.js";
import { autMiddleware } from "../helpers/authMiddleware.js";
import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schema/usersSchemas.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", validateBody(registerUserSchema), jsonParser, register);
usersRouter.post("/login", validateBody(loginUserSchema), jsonParser, login);
usersRouter.post("/logout", autMiddleware, jsonParser, logout);
usersRouter.post("/current", autMiddleware, current);


export default usersRouter;