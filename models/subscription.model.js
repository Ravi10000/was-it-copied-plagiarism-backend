import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  validity: {
    type: Number, // in days
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Subscription", subscriptionSchema);
 