import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema({
  subscription: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["INITIATED", "SUCCESS", "FAILED"],
    default: "INITIATED",
  },
  amount: {
    type: Number,
    required: true,
  },
  successDetails: {
    type: Object,
    default: {},
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.model("Transaction", transactionSchema);
