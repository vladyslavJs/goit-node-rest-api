import User from "../models/user.js"
import HttpError from "../helpers/HttpError.js";

export async function register(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user !== null) {
            throw HttpError(409, "Email in use");
        }

        await User.create({ ...req.body, password });

        res.send("Register");
    } catch (error) {
        next(error);
    }


};

