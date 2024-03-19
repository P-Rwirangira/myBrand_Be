"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByEmail = exports.getAllUsers = exports.login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const users_1 = require("../validations/users");
const jwtSecret = 'Speed';
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email, role } = req.body;
        const { error } = users_1.signInVal.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const existingUser = yield User_1.default.findOne({ $or: [{ email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({ password: hashedPassword, email, role });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ role: newUser.role }, jwtSecret, {
            expiresIn: '2h'
        });
        res.status(201)
            .header('Authorization', `Bearer ${token}`)
            .send({ message: 'User created successfully', token });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { error } = users_1.loginVal.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const user = yield User_1.default.findOne({ $or: [{ email }] });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ role: user.role }, jwtSecret, {
            expiresIn: '10h'
        });
        res.status(200)
            .header('Authorization', `Bearer ${token}`)
            .send({ message: 'Login successful!!', token: token, role: user.role, email: user.email });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});
exports.getAllUsers = getAllUsers;
const deleteUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userEmail = req.params.email;
        userEmail = userEmail.toLowerCase();
        const deletedUser = yield User_1.default.findOneAndDelete({ email: userEmail });
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.deleteUserByEmail = deleteUserByEmail;
