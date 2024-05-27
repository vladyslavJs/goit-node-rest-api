import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import User from "../models/user.js"

import HttpError from "../helpers/HttpError.js";
import { sendMail } from "../helpers/emailVerify.js";

import "dotenv/config";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "node:path";
import Jimp from "jimp";
import { log } from "console";
import { nanoid } from "nanoid";


export async function register(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user !== null) {
            throw HttpError(409, "Email in use");
        }

        const avatarURL = gravatar.url(email);

        const passwordHash = await bcrypt.hash(password, 10);
        const verifyToken = nanoid();

        const newUser = await User.create({
            email,
            password: passwordHash,
            avatarURL,
        });

        sendMail({
            to: email,
            from: "vladyslavmelnyk15@gmail.com",
            subject: "Welcome to our service!",
            html: `<h2 style="color: #808080">To complete your registration and activate your account, please click on the following link:<a href="http://localhost:3000/api/usersRouter/verify/${verifyToken}">link<a></h2>`,
            text: `To complete your registration and activate your account, please click on the following link:<a href="http://localhost:3000/api/usersRouter/verify/${verifyToken}"`
        });


        const { subscription } = newUser;

        res.status(201).json({
            user:
            {
                email,
                subscription,
                avatarURL,
            },
        });
    } catch (error) {
        next(error);
    }
};

export async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user === null) {
            console.log("Email");
            throw HttpError(401, "Email or password is incorrect");
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (comparePassword === false) {
            console.log("Password");
            throw HttpError(401, "Email or password is incorrect");
        }

        const payload =
        {
            id: user._id,
            name: user.name,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        await User.findByIdAndUpdate(user._id, { token });

        res.status(201).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
                avatarURL: user.avatarURL,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { token: null });

        if (user === null) {
            throw HttpError(401, "Not authorized")
        }

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

export async function current(req, res, next) {
    try {
        const user = await User.findById(req.user.id)

        if (user === null) {
            throw HttpError(401, "Not authorized")
        }

        res.status(200).json({ email: user.email, subscription: user.subscription });
    }
    catch (error) {
        next(error);
    }
}

export async function getAvatar(req, res, next) {
    try {
        const user = await User.findById(req.user.id);

        if (user === null) {
            throw HttpError(404, "User not found");
        }

        if (user.avatarURL === null) {
            throw HttpError(404, "Avatar not found");
        }
        res.sendFile(path.resolve("public/avatars", user.avatarURL));

    } catch (error) {
        next(error);
    }
}

export async function updateAvatar(req, res, next) {
    try {
        if (req.file === undefined) {
            return res.status(400).send("Please select the avatar file");
        }

        console.log('req.file', req.file);
        const absolvePath = path.resolve("public/avatars", req.file.filename);

        await fs.rename(
            req.file.path,
            absolvePath,
        );

        const avatarHandling = await Jimp.read(absolvePath);
        await avatarHandling.resize(250, 250).writeAsync(absolvePath);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatarURL: `/avatars/${req.file.filename}` },
            { new: true },
        );

        if (user == null) {
            throw HttpError(404, "User not found");
        }

        res.status(200).json({ avatarURL: user.avatarURL });

    } catch (error) {
        next(error);
    }
}

export async function verify(req, res, next) {
    try {

    } catch (error) {
        next(error)

    }
}

export async function resendVerificationEmail(req, res, next) {
    try {

    } catch (error) {
        next(error)
    }
}
