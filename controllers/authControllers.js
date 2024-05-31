import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js"
import { sendMail } from "../helpers/emailVerify.js";
import "dotenv/config";
import { nanoid } from "nanoid";
import { log } from "console";

export async function register(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user !== null) {
            throw HttpError(409, "Email in use");
        }

        const avatarURL = gravatar.url(email);

        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = nanoid();

        const newUser = await User.create({
            email,
            password: passwordHash,
            avatarURL,
            verificationToken,
        });

        await sendMail({
            to: email,
            verificationToken,
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

        if (user.verify === false) {
            throw HttpError(401, "Please verify your email");
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