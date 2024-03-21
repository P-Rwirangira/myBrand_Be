"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogVal = void 0;
const joi_1 = __importDefault(require("joi"));
exports.blogVal = joi_1.default.object({
    title: joi_1.default.string().min(5),
    subtitle: joi_1.default.string().min(5),
    content: joi_1.default.string().min(5)
}).unknown(false);
