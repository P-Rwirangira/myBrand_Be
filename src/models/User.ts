import mongoose, { Document } from "mongoose";

export interface UserDocument extends Document {
  username:string,
  email: string;
  password: string;
  phone:string;
  role: string;
  timecreated:Date
}

const schema = mongoose.Schema;

const userSchema = new schema<UserDocument>({
  username: { type: String,default:"User" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String,default:"No phone number yet added!" },
  timecreated:{type:Date,default: function() 
    {
    const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
