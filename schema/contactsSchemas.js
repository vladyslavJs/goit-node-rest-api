import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(10)
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
        .min(6)
        .max(15)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: false } })
        .required(),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
});