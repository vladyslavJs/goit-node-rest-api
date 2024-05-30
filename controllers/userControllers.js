import Jimp from "jimp";
import fs from "fs/promises";
import path from "node:path";
import "dotenv/config";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js"
import { sendMail } from "../helpers/emailVerify.js";
import { nanoid } from "nanoid";

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
    const { verificationToken } = req.params;
    try {
        const user = await User.findOneAndUpdate({ verificationToken }, { verify: true, verificationToken: null })

        if (user === null) {
            throw HttpError(404, "User not found");
        }

        res.status(200).json({ message: "Verification successful" });

    } catch (error) {
        next(error)

    }
}

export async function resendVerificationEmail(req, res, next) {
    const { email } = req.body;
    try {
        const verificationToken = nanoid();

        const user = await User.findOneAndUpdate({ email }, { verificationToken }, { new: true });

        if (user === null) {
            return next(HttpError(404, "User not found"));
        }

        if (user.verify) {
            return next(HttpError(400, "Verification has already been passed"));
        }

        await sendMail({
            to: email,
            from: process.env.EMAIL_SENDER,
            subject: "Re-verification in Contact Kingdom",
            html: `<h2 style="color: #000000; font-family: Arial;">Your re-verification <a href="http://localhost:3000/users/verify/${verificationToken}">link</a></h2>`,
            text: `Your re-verification link: http://localhost:3000/users/verify/${verificationToken}`,
        })

        res.status(201).json({ message: "Verification email sent" })

    } catch (error) {
        next(error)
    }
}
