import Joi from "joi";

export const msgVal = Joi.object({
  title: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(5).required(),
}).unknown(false);