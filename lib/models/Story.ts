import mongoose, { Schema } from "mongoose";
const schema = new Schema({
  key: { type: String, required: true, unique: true },
  revision: { type: Number, default: 0 },
  content: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });
export default mongoose.models.Story ?? mongoose.model("Story", schema);
