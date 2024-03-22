import Joi from "joi";

export const msgVal = Joi.object({
  names: Joi.string().min(4).required(),
  email: Joi.string().email().required()
}).unknown(true);