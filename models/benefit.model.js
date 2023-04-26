import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BenefitSchema = new Schema({
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

export default mongoose.model("PlagiarismBenefit", BenefitSchema);
