"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgVal = void 0;
const joi_1 = __importDefault(require("joi"));
exports.msgVal = joi_1.default.object({
    names: joi_1.default.string().min(4).required(),
    email: joi_1.default.string().email().required()
}).unknown(true);
