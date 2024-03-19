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
exports.likePost = void 0;
const Like_1 = __importDefault(require("../models/Like"));
const Blog_1 = __importDefault(require("../models/Blog"));
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, postId } = req.body;
        let existingLike = yield Like_1.default.findOne({ email });
        if (!existingLike) {
            existingLike = new Like_1.default({
                email,
                likedPosts: new Map([[postId, true]])
            });
        }
        else {
            if (!existingLike.likedPosts) {
                existingLike.likedPosts = new Map();
            }
            if (existingLike.likedPosts.has(postId)) {
                existingLike.likedPosts.delete(postId);
                yield existingLike.save();
                yield Blog_1.default.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
                res.status(200).json({ message: 'Post unliked' });
                return;
            }
            existingLike.likedPosts.set(postId, true);
        }
        yield existingLike.save();
        yield Blog_1.default.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
        res.status(200).json({ message: 'Post liked successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});
exports.likePost = likePost;
