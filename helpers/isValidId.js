import { isValidObjectId } from "mongoose";
import HttpError from "./HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} in not valid id`));
  }

  next();
};

export default isValidId;