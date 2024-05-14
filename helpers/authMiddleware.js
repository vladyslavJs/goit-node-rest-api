import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "./HttpError.js";

export async function autMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (typeof authorizationHeader === "undefined") {
        return next(HttpError(401, "Not authorized"));
    }

    const [bearer, token] = authorizationHeader.split(" ", 2);
    console.log({ bearer, token });

    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not authorized"));
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    jwt.verify(token, JWT_SECRET, async (error, decode) => {
        if (error) {
            return next(HttpError(401, "Not authorized"));
        }
    })

    try {
        const user = await User.findById(decode.id);
        if (user === null) {
            return next(HttpError(401, "Not authorized"));
        }

        if (user.token !== token) {
            return next(HttpError(401, "Not authorized"));
        }
        console.log({ decode });

        req.user = {
            id: decode.id,
            email: decode.email,
        };

    } catch (error) {
        next(error);
    }
}
