import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  
  subtitle:{
    type:String,
    required:true

  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  comments: [commentSchema],
  likes: {
    type: Number,
    default: 0 
  },
  views:{
    type:Number,
    default:0

  },
  timecreated:{
    type:Date,
    default: function() {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
