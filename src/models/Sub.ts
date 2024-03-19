import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model("Subscriber", subscriberSchema);
