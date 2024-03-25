import { Request, Response } from 'express';
import Blog from '../models/Blog';
import { blogVal } from '../validations/blogs';
import cloudinary from '../middlewares/cloudinary';
import { commentVal } from '../validations/comment';

// View a blog post
export const viewBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment views
    blog.views++;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to view blog post' });
  }
};
//create the blog 

export const createBlog = async (req: Request, res: Response) => {
    try {
        let image = null;
  
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          image = result ? result.secure_url : null;
        }
  
        const { title,subtitle, content } = req.body;
        const { error } = blogVal.validate(req.body);
        if (error) {
          return res.status(400).send({ error: error.details[0].message });
        }
  
        const blog = new Blog({
          title,
          subtitle,
          content,
          image,
        });
  
        const savedBlog = await blog.save();
        res.status(201).send({ savedBlog, message: 'Blog created successfully!!' });
  
      } catch (error) {
        res.status(500).send({ message: (error as Error).message });
      }
    }
      
// ALL
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();

    if (blogs.length === 0) {
      res.status(404).json({ message: 'No blog posts found' });
    } else {
      res.status(200).json(blogs);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blog posts' });
  }
};

// one
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id; 
    const blog = await Blog.findById(blogId);


    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ error: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blog post' });
  }
};

export const updateBlogById = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const { error } = blogVal.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    let image = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log('Cloudinary upload result:', result); 
      image = result ? result.secure_url : null;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.send({ updatedBlog, message: 'Blog updated!' });
  } catch (err: any) {
    return res.status(500).send({ message: (err as Error).message });
  }
};

export const deleteBlogById = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (deletedBlog) {
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};
// comment 

export const addComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email, comment } = req.body;
  
      const { error } = commentVal.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      blog.comments.push({ email, comment });
      const updatedBlog = await blog.save();
      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add comment to blog post' });
    }
  };

   