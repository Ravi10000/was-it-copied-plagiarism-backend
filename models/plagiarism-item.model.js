import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PlagiarismItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

export default mongoose.model("PlagiarismItem", PlagiarismItemSchema);
