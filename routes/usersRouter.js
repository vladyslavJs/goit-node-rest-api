import express from "express";

import { register, login, logout, current, getAvatar, updateAvatar, verify, resendVerificationEmail } from "../controllers/userControllers.js";

import { authMiddleware } from "../helpers/authMiddleware.js";
import { update } from "../helpers/upload.js";

import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema, verifyUserSchema } from "../schema/usersSchemas.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", validateBody(registerUserSchema), jsonParser, register);
usersRouter.post("/login", validateBody(loginUserSchema), jsonParser, login);
usersRouter.post("/logout", authMiddleware, jsonParser, logout);
usersRouter.get("/current", authMiddleware, current);

usersRouter.get("/avatars", authMiddleware, getAvatar);
usersRouter.patch("/avatars", authMiddleware, update.single("avatar"), updateAvatar);

usersRouter.get("/verify/:verificationToken", verify);
usersRouter.post("verify", validateBody(verifyUserSchema), resendVerificationEmail);


export default usersRouter;