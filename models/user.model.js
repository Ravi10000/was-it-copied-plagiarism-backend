import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    // required: true,
  },
  lname: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    unique: true,
    // required: true,
  },
  profilePic: {
    type: String,
  },
  hash: {
    type: String,
    // required: true,
  },
  usertype: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  schoolName: {
    type: String,
  },
  currentSubscriptionPlan: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
