import express from "express";

import { authMiddleware } from "../helpers/authMiddleware.js";
import { validateBody } from "../helpers/validateBody.js";
import {
    loginUserSchema,
    registerUserSchema
} from "../schema/usersSchemas.js";
import {
    register,
    login,
    logout,
    current
} from "../controllers/authControllers.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", validateBody(registerUserSchema), jsonParser, register);
usersRouter.post("/login", validateBody(loginUserSchema), jsonParser, login);
usersRouter.post("/logout", authMiddleware, jsonParser, logout);
usersRouter.get("/current", authMiddleware, current);

export default usersRouter;