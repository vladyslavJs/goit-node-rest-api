import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .trim()
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: false } })
        .lowercase()
        .trim()
        .required(),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
    favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: false } })
        .lowercase()
        .trim(),
    phone: Joi.string()
        .pattern(/^(\+?38)?(0\d{9})$/)
        .trim(),
})
    .min(1).message("Body must have at least one field");

export const updateStatusContactSchema = Joi.object({
    favorite: Joi.boolean()
        .required(),
});