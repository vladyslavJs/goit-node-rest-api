import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import User from "../models/user.js"
import HttpError from "../helpers/HttpError.js";
import "dotenv/config";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "node:path";

export async function register(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user !== null) {
            throw HttpError(409, "Email in use");
        }

        const avatarURL = gravatar.url(email);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: passwordHash, avatarURL });

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
        next(next);
    }
}

export async function updateAvatar(req, res, next) {
    try {
        await fs.rename(
            req.file.path,
            path.resolve("public/avatars", req.file.filename),
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatarURL: req.file.filename },
            { new: true },
        );

        if (user == null) {
            throw HttpError(404, "User not found");
        }

        res.send(user);

    } catch (error) {
        next(next);
    }
}

