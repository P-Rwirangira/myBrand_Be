import express from 'express';
import upload from '../middlewares/multer';
import { addComment, createBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlogById } from '../controllers/blogs';
import { likePost } from '../controllers/liking';
import { createMessage, deleteMessageById, getAllMessages, getMessageById } from '../controllers/messages';
import { createUser, deleteUserByEmail, getAllUsers, login } from '../controllers/users';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth';
import { getSubs,getAllSubs,createSubs,deleteSubs } from '../controllers/subs';

const router = express.Router();


// blogs 
router.get('/blogs', getAllBlogs);
router.post('/blogs',authenticateUser,authorizeAdmin,upload.single("image"), createBlog);
router.get('/blogs/:id', getBlogById);
router.patch('/blogs/:id',authenticateUser,authorizeAdmin,upload.single("image"), updateBlogById);
router.delete('/blogs/:id',authenticateUser,authorizeAdmin, deleteBlogById);
router.post('/blogs/:id/like',authenticateUser, likePost);
router.post('/blogs/:id/comment',authenticateUser, addComment);


// messages
router.get('/messages',authenticateUser,authorizeAdmin, getAllMessages);
router.get('/messages/:id', authenticateUser,authorizeAdmin,getMessageById);
router.post('/messages', createMessage);
router.delete('/messages/:id', authenticateUser,authorizeAdmin,deleteMessageById);

// subs
router.get('/subs',authenticateUser,authorizeAdmin,getAllSubs);
router.get('/subs/:id',authenticateUser,authorizeAdmin,getSubs);
router.post('/subs',createSubs);
router.delete('/subs/:id',authenticateUser,authorizeAdmin,deleteSubs)


// accounts
router.get('/users',authenticateUser,authorizeAdmin, getAllUsers);
router.post('/login', login);
router.post('/signup', createUser);
router.delete('/users/:email',authenticateUser,authorizeAdmin, deleteUserByEmail);

export default router;
