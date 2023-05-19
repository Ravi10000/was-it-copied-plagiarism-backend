import mongoose from "mongoose";

const { Schema } = mongoose;

const ScanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["URL", "FILE", "TEXT"],
  },
  fileExtension: {
    type: String,
  },
  text: {
    type: String,
    // required: true,
  },
  result: {
    type: Map,
    of: String,
    // required: true,
  },
});

export default mongoose.model("Scan", ScanSchema);
