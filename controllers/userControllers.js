import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import HttpError from "../helpers/HttpError.js";

export async function register(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user !== null) {
            throw HttpError(409, "Email in use");
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: passwordHash });

        const { subscription } = newUser;

        res.status(201).json({
            user:
            {
                email,
                subscription,
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
                email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const user = await User.findByIdAndUpdate({ _id: req.user.id }, { token: null });

        if (user === null) {
            throw HttpError(401, "Not authorized")
        }

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

export async function current(req, res, next) {
    const user = User.findById(req.user.id)

    if (user === null) {
        throw HttpError(401, "Not authorized")
    }

    res.status(200).json({ email: user.email, subscription: user.subscription });
}

