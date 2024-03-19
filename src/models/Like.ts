import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  likedPosts: {
    type: Map,
    of: Boolean
  }
});

const Like = mongoose.model('Like', likeSchema);

export default Like;
