import { Schema, model } from "mongoose";

const FaqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
const Faq = model("faq", FaqSchema);
export default Faq;
