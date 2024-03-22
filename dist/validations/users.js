"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginVal = exports.signInVal = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signInVal = joi_1.default.object({
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid('admin', 'user').optional(),
}).unknown(true);
exports.loginVal = joi_1.default.object({
    email: joi_1.default.string().email(),
    password: joi_1.default.string().required(),
}).xor('email').required().unknown(true);
