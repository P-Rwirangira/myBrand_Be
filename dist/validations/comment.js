"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentVal = void 0;
const joi_1 = __importDefault(require("joi"));
exports.commentVal = joi_1.default.object({
    comment: joi_1.default.string().min(5).required(),
    email: joi_1.default.string().email().required(),
}).unknown(false);
