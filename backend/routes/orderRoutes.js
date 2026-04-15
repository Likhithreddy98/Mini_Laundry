const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getDashboard,
  getOrderById,
  updateOrderStatus,
  getPrices,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/prices", getPrices);
router.get("/dashboard", getDashboard);
router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
