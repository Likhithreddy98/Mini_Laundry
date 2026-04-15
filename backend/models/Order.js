const mongoose = require("mongoose");

const GARMENT_TYPES = ["Shirt", "Pants", "Saree", "Kurta", "Jacket", "Bedsheet", "Towel"];
const STATUS_VALUES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"],
    },
    garmentType: {
      type: String,
      required: [true, "Garment type is required"],
      enum: GARMENT_TYPES,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    totalBill: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: "RECEIVED",
    },
    estimatedDelivery: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
