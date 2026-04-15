const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");

const PRICES = {
  Shirt: 250,
  Pants: 500,
  Saree: 300,
  Kurta: 400,
  Jacket: 700,
  Bedsheet: 450,
  Towel: 200,
};

const getEstimatedDelivery = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date;
};

const createOrder = async (req, res) => {
  try {
    const { customerName, phone, garmentType, quantity } = req.body;

    if (!customerName || !phone || !garmentType || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Enter a valid 10-digit phone number" });
    }

    if (!PRICES[garmentType]) {
      return res.status(400).json({
        message: `Invalid garment type. Choose from: ${Object.keys(PRICES).join(", ")}`,
      });
    }

    if (quantity < 1 || !Number.isInteger(Number(quantity))) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const pricePerUnit = PRICES[garmentType];
    const totalBill = pricePerUnit * Number(quantity);
    const orderId = `ORD-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;

    const order = await Order.create({
      orderId,
      customerName,
      phone,
      garmentType,
      quantity: Number(quantity),
      pricePerUnit,
      totalBill,
      estimatedDelivery: getEstimatedDelivery(),
      status: "RECEIVED",
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { status, search, garmentType } = req.query;

    const filter = {};

    if (status) {
      filter.status = status.toUpperCase();
    }

    if (garmentType) {
      filter.garmentType = garmentType;
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalBill" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusBreakdown = {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0,
    };
    statusCounts.forEach((s) => {
      statusBreakdown[s._id] = s.count;
    });

    res.json({ totalOrders, totalRevenue, statusBreakdown });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        message: `Invalid status. Choose from: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: status.toUpperCase() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPrices = async (req, res) => {
  res.json({ prices: PRICES });
};

module.exports = { createOrder, getOrders, getDashboard, getOrderById, updateOrderStatus, getPrices };
