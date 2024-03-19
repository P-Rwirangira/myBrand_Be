import { Request, Response } from 'express';
import Like from '../models/Like';
import Blog from '../models/Blog';

export const likePost = async (req: Request, res: Response) => {
    try {
        const { email, postId } = req.body;

        let existingLike = await Like.findOne({ email });

        if (!existingLike) {
            existingLike = new Like({
                email,
                likedPosts: new Map([[postId, true]])
            });
        } else {
            if (!existingLike.likedPosts) {
                existingLike.likedPosts = new Map();
            }

            if (existingLike.likedPosts.has(postId)) {
                existingLike.likedPosts.delete(postId);
                await existingLike.save();
                await Blog.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
                res.status(200).json({ message: 'Post unliked' });
                return;
            }

            existingLike.likedPosts.set(postId, true);
        }

        await existingLike.save();
        await Blog.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
        res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to like post' });
    }
};
