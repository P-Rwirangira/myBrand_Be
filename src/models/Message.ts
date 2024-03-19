import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
