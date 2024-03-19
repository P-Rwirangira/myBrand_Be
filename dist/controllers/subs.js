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
exports.deleteSubs = exports.createSubs = exports.getSubs = exports.getAllSubs = void 0;
const Sub_1 = __importDefault(require("../models/Sub"));
const subs_1 = require("../validations/subs");
// Get all subscribers
const getAllSubs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield Sub_1.default.find();
        res.status(200).json(subscribers);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve subscribers' });
    }
});
exports.getAllSubs = getAllSubs;
// Get one subscriber by ID
const getSubs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriberId = req.params.id;
        const subscriber = yield Sub_1.default.findById(subscriberId);
        if (subscriber) {
            res.status(200).json(subscriber);
        }
        else {
            res.status(404).json({ error: 'Subscriber not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve subscriber' });
    }
});
exports.getSubs = getSubs;
// Create a new subscriber
const createSubs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const { error } = subs_1.subVal.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newSubscriber = new Sub_1.default({
            email,
        });
        const savedSubscriber = yield newSubscriber.save();
        res.status(201).json({ subscriber: savedSubscriber, message: 'Subscriber added successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.createSubs = createSubs;
// Delete a subscriber by ID
const deleteSubs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriberId = req.params.id;
        const deletedSubscriber = yield Sub_1.default.findByIdAndDelete(subscriberId);
        if (deletedSubscriber) {
            res.status(200).json({ message: 'Subscriber deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Subscriber not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete subscriber' });
    }
});
exports.deleteSubs = deleteSubs;
