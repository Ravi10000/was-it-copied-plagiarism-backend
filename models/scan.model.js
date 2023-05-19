import mongoose from "mongoose";

const { Schema } = mongoose;

const ScanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    // required: true,
  },
  response: {
    type: Object,
    // required: true,
  },
});

export default mongoose.model("Scan", ScanSchema);
