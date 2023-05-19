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
  result: {
    type: String,
    // required: true,
  },
});

export default mongoose.model("Scan", ScanSchema);
