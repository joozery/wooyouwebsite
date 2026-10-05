import mongoose, { Schema } from "mongoose";

const portfolioSchema = new Schema({
  key: { type: String, unique: true, required: true },
  revision: { type: Number, default: 0 },
  projects: [{
    _id: false,
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    subtitle: String,
    description: String,
    image: { type: String, required: true },
    gallery: [String],
    tags: String,
    isVisible: { type: Boolean, default: true },
  }],
}, { timestamps: true });

export default mongoose.models.Portfolio ?? mongoose.model("Portfolio", portfolioSchema);
