import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import HttpError from "../helpers/HttpError.js";

// const { DB_URI } = process.env;


export async function register(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user !== null) {
            throw HttpError(409, "Email in use");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await User.create(
            {
                ...req.body,
                password: passwordHash,
            });

        res.status(201).json({
            message: "Registration successfully",
            // user: { email, subscription: "starter" }
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

        const payload = { id: user._id, name: user.name };

        // const token = jwt.sign(
        //     payload,
        //     process.env.JWT_SECRET,
        //     { expiresIn: 60 * 60 },
        // );

        await User.findByIdAndUpdate(user._id, { token });

        res.status(201).json({ token: token, user: { email, subscription: user.subscription } });

    } catch (error) {
        next(error);
    }
}
