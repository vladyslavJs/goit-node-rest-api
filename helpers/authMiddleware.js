import jwt from "jsonwebtoken";
import User from "../models/user.js";

export function authMiddleware(req, res, next) {
    const authToken = req.headers.authorization;

    if (typeof authToken === "undefined") {
        return res.status(401).send("Not authorized");
    }

    const [bearer, token] = authToken.split(" ", 2);

    if (bearer !== "Bearer") {
        return res.status(401).send("Not authorized");
    }

    jwt.verify(token, process.env.JWT_KEY, async (error, decode) => {
        if (error) {
            return res.status(401).send("Not authorized");
        }
        try {
            const user = await User.findById(decode.id);

            if (user === null) {
                return res.status(401).send("Not authorized");
            }

            if (user.token !== token) {
                return res.status(401).send("Not authorized");
            }

            req.user = {
                id: decode.id,
                email: decode.email,
            };

            next();
        } catch (error) {
            next(error);
        }
    });
}