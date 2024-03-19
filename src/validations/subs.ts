import Joi from "joi";

export const subVal = Joi.object({
  email: Joi.string().email().required(),
}).unknown(false);
