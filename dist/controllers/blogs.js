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
exports.addComment = exports.deleteBlogById = exports.updateBlogById = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const blogs_1 = require("../validations/blogs");
const cloudinary_1 = __importDefault(require("../middlewares/cloudinary"));
const comment_1 = require("../validations/comment");
// create
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let image = null;
        if (req.file) {
            const result = yield cloudinary_1.default.uploader.upload(req.file.path);
            image = result ? result.secure_url : null;
        }
        const { title, subtitle, content } = req.body;
        const { error } = blogs_1.blogVal.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        const blog = new Blog_1.default({
            title,
            subtitle,
            content,
            image,
        });
        const savedBlog = yield blog.save();
        res.status(201).send({ savedBlog, message: 'Blog created successfully!!' });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.createBlog = createBlog;
// ALL
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield Blog_1.default.find();
        if (blogs.length === 0) {
            res.status(404).json({ message: 'No blog posts found' });
        }
        else {
            res.status(200).json(blogs);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog posts' });
    }
});
exports.getAllBlogs = getAllBlogs;
// one
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.id;
        const blog = yield Blog_1.default.findById(blogId);
        if (blog) {
            res.status(200).json(blog);
        }
        else {
            res.status(404).json({ error: 'Blog post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog post' });
    }
});
exports.getBlogById = getBlogById;
const updateBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const { error } = blogs_1.blogVal.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        let image = null;
        if (req.file) {
            const result = yield cloudinary_1.default.uploader.upload(req.file.path);
            console.log('Cloudinary upload result:', result);
            image = result ? result.secure_url : null;
        }
        const updatedBlog = yield Blog_1.default.findByIdAndUpdate(req.params.id, { title, content, image }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.send({ updatedBlog, message: 'Blog updated!' });
    }
    catch (err) {
        return res.status(500).send({ message: err.message });
    }
});
exports.updateBlogById = updateBlogById;
const deleteBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.id;
        const deletedBlog = yield Blog_1.default.findByIdAndDelete(blogId);
        if (deletedBlog) {
            res.status(200).json({ message: 'Blog post deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Blog post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});
exports.deleteBlogById = deleteBlogById;
// comment 
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, comment } = req.body;
        const { error } = comment_1.commentVal.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const blog = yield Blog_1.default.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        blog.comments.push({ email, comment });
        const updatedBlog = yield blog.save();
        res.status(200).json(updatedBlog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add comment to blog post' });
    }
});
exports.addComment = addComment;
