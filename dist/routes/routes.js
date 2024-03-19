"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const blogs_1 = require("../controllers/blogs");
const liking_1 = require("../controllers/liking");
const messages_1 = require("../controllers/messages");
const users_1 = require("../controllers/users");
const auth_1 = require("../middlewares/auth");
const subs_1 = require("../controllers/subs");
const router = express_1.default.Router();
// blogs 
router.get('/blogs', blogs_1.getAllBlogs);
router.post('/blogs', auth_1.authenticateUser, auth_1.authorizeAdmin, multer_1.default.single("image"), blogs_1.createBlog);
router.get('/blogs/:id', blogs_1.getBlogById);
router.patch('/blogs/:id', auth_1.authenticateUser, auth_1.authorizeAdmin, multer_1.default.single("image"), blogs_1.updateBlogById);
router.delete('/blogs/:id', auth_1.authenticateUser, auth_1.authorizeAdmin, blogs_1.deleteBlogById);
router.post('/blogs/:id/like', auth_1.authenticateUser, liking_1.likePost);
router.post('/blogs/:id/comment', auth_1.authenticateUser, blogs_1.addComment);
// messages
router.get('/messages', auth_1.authenticateUser, auth_1.authorizeAdmin, messages_1.getAllMessages);
router.get('/messages/:id', auth_1.authenticateUser, auth_1.authorizeAdmin, messages_1.getMessageById);
router.post('/messages', messages_1.createMessage);
router.delete('/messages/:id', auth_1.authenticateUser, auth_1.authorizeAdmin, messages_1.deleteMessageById);
// subs
router.get('/subs', auth_1.authenticateUser, auth_1.authorizeAdmin, subs_1.getAllSubs);
router.get('/subs/:id', auth_1.authenticateUser, auth_1.authorizeAdmin, subs_1.getSubs);
router.post('/subs', subs_1.createSubs);
router.delete('/subs/:id', auth_1.authenticateUser, auth_1.authorizeAdmin, subs_1.deleteSubs);
// accounts
router.get('/users', auth_1.authenticateUser, auth_1.authorizeAdmin, users_1.getAllUsers);
router.post('/login', users_1.login);
router.post('/signup', users_1.createUser);
router.delete('/users/:email', auth_1.authenticateUser, auth_1.authorizeAdmin, users_1.deleteUserByEmail);
exports.default = router;
