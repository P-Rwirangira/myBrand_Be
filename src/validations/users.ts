import Joi from "joi";

export const signInVal = Joi.object({
  username: Joi.string().min(4).alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
  role: Joi.string().valid('admin', 'user').optional(),
}).unknown(false);

export const loginVal = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
  }).xor('username', 'email').required().unknown(false);
  