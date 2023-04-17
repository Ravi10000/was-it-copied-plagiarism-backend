import mongoose from "mongoose";
const { Schema } = mongoose;

const emailVerificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("EmailVerification", emailVerificationSchema);
