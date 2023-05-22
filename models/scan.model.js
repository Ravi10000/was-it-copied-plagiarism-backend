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
  title: {
    type: String,
    // required: true,
  },
  result: {
    type: String,
    // required: true,
  },
  filePath: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Scan", ScanSchema);
