import mongoose from "mongoose";

const { Schema } = mongoose;

const ScanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "CREATED",
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
    type: String,
    // required: true,
  },
});

export default mongoose.model("Scan", ScanSchema);
