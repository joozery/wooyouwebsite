import mongoose, { Schema, InferSchemaType } from "mongoose";

const invoiceItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["paid", "pending", "draft", "overdue"],
      default: "draft",
    },
    dueDate: { type: Date },
    items: [invoiceItemSchema],
    notes: { type: String },
  },
  { timestamps: true }
);

export type InvoiceType = InferSchemaType<typeof invoiceSchema>;

export default mongoose.models.Invoice ?? mongoose.model("Invoice", invoiceSchema);
