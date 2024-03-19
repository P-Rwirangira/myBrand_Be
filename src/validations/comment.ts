import Joi from "joi";

export const commentVal = Joi.object({
  comment: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
}).unknown(false);