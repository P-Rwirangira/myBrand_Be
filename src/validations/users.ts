import Joi from "joi";

export const signInVal = Joi.object({
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'user').optional(),
}).unknown(true);

export const loginVal = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required(),
  }).xor('email').required().unknown(true);
  