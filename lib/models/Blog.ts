import mongoose, { Schema, InferSchemaType } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    author: { type: String, default: "Wooyou Creative" },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export type BlogType = InferSchemaType<typeof blogSchema>;

export default mongoose.models.Blog ?? mongoose.model("Blog", blogSchema);
