"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const userSchema = new schema({
    username: { type: String, default: "User" },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, default: "No phone number yet added!" },
    timecreated: { type: Date, default: function () {
            const today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
