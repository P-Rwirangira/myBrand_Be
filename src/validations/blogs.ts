import joi from 'joi';

export const blogVal = joi.object({
    title:joi.string().min(5),
    subtitle:joi.string().min(5),
    content:joi.string().min(5)
}).unknown(false);