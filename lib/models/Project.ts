import mongoose, { Schema, InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    clientName: { type: String },
    sector: { type: String, enum: ["government", "private"], default: "private" },
    url: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectType = InferSchemaType<typeof projectSchema>;

export default mongoose.models.Project ?? mongoose.model("Project", projectSchema);
