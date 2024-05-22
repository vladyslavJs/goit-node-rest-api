import express from "express";

import { register, login, logout, current, getAvatar, updateAvatar } from "../controllers/userControllers.js";

import { authMiddleware } from "../helpers/authMiddleware.js";
import { update } from "../helpers/upload.js";

import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schema/usersSchemas.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", validateBody(registerUserSchema), jsonParser, register);
usersRouter.post("/login", validateBody(loginUserSchema), jsonParser, login);
usersRouter.post("/logout", authMiddleware, jsonParser, logout);
usersRouter.get("/current", authMiddleware, current);

usersRouter.get("/avatar", authMiddleware, getAvatar);
usersRouter.patch("/avatar", authMiddleware, update.single("avatar"), updateAvatar);


export default usersRouter;