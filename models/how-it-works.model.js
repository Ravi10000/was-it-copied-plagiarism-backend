import mongoose from "mongoose";
import { Schema } from "mongoose";

const howItWorksSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
});

export default mongoose.model("HowItWork", howItWorksSchema);
