import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    position: { type: String },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["super_admin", "admin", "moderator"], default: "admin" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lastLogin: { type: String, default: "-" },
  },
  { timestamps: true }
);

export default mongoose.models.Admin ?? mongoose.model("Admin", adminSchema);
