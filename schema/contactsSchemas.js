import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: false } })
        .required(),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: false } })
        .required(),
    phone: Joi.string()
        .pattern(/^(\+?38)?(0\d{9})$/),
});