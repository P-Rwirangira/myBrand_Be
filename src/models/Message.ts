import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  names: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    default:"No message yet!"
  },
  phone: {
    type: String,
    required: true,
    default:"No phone number yet!"
  },
  timecreated:{
    type:Date,
    default: function() {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
