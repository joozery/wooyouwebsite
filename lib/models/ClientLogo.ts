import mongoose, { Schema, InferSchemaType } from "mongoose";

const clientLogoSchema = new Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ClientLogoType = InferSchemaType<typeof clientLogoSchema>;

export default mongoose.models.ClientLogo
  ?? mongoose.model("ClientLogo", clientLogoSchema);
