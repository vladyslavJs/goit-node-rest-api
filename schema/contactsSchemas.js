import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().min().email().required(),
    phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().min().email().required(),
    phone: Joi.string().max(11).required(),
});