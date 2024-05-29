import express from "express";

import {
    getAvatar,
    updateAvatar,
    verify,
    resendVerificationEmail
} from "../controllers/userControllers.js";

import { authMiddleware } from "../helpers/authMiddleware.js";
import { update } from "../helpers/upload.js";

import { validateBody } from "../helpers/validateBody.js";
import { verifyUserSchema } from "../schema/usersSchemas.js";

const usersRouter = express.Router();

usersRouter.get("/avatars", authMiddleware, getAvatar);
usersRouter.patch("/avatars", authMiddleware, update.single("avatar"), updateAvatar);

usersRouter.get("/verify/:verificationToken", verify);
usersRouter.post("verify", validateBody(verifyUserSchema), resendVerificationEmail);


export default usersRouter;