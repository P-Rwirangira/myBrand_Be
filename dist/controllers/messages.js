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
exports.deleteMessageById = exports.createMessage = exports.getMessageById = exports.getAllMessages = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const messages_1 = require("../validations/messages");
// get
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find();
        res.status(200).json(messages);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});
exports.getAllMessages = getAllMessages;
// one message
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = req.params.id;
        const message = yield Message_1.default.findById(messageId);
        if (message) {
            res.status(200).json(message);
        }
        else {
            res.status(404).json({ error: 'Message not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve message' });
    }
});
exports.getMessageById = getMessageById;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, names, email, message } = req.body;
        const { error } = messages_1.msgVal.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const query = new Message_1.default({
            names,
            email,
            phone,
            message,
        });
        const savedQuery = yield query.save();
        res.status(201).json({ Query: savedQuery, message: 'Your message is sent successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.createMessage = createMessage;
const deleteMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = req.params.id;
        const deletedMessage = yield Message_1.default.findByIdAndDelete(messageId);
        if (deletedMessage) {
            res.status(200).json({ message: 'Message deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Message not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});
exports.deleteMessageById = deleteMessageById;
