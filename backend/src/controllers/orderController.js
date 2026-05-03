import { MenuItem } from "../models/MenuItem.js";
import { Order } from "../models/Order.js";
import { createOrder as createOrderFromService } from "../services/orderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertArray, assertOptionalString, assertString } from "../utils/validators.js";

const STAFF_ROLES = ["ADMIN", "ORDER_MANAGER"];

export const getAllOrders = asyncHandler(async (req, res) => {
  const isStaff = STAFF_ROLES.includes(req.user?.role);
  const query = isStaff ? {} : { userId: req.user._id };
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const isStaff = STAFF_ROLES.includes(req.user?.role);
  if (!isStaff && String(order.userId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(order);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items = [], promoCode, deliveryAddress } = req.body;

  const normalizedItems = assertArray(items, "items", { minLength: 1 });
  assertOptionalString(promoCode, "promoCode", { max: 20 });
  assertOptionalString(deliveryAddress, "deliveryAddress", { max: 200 });

  // Order belongs to the authenticated customer, not an arbitrary userId from the client.
  const order = await createOrderFromService({
    userId: req.user._id,
    items: normalizedItems,
    promoCode,
    deliveryAddress
  });

  res.status(201).json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const nextStatus = req.query.status ? String(req.query.status) : order.status;
  const allowed = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];
  if (!allowed.includes(nextStatus)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(", ")}` });
  }

  order.status = nextStatus;
  await order.save();
  res.json(order);
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Only the owner can cancel
  if (String(order.userId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (order.status !== "Pending") {
    return res.status(400).json({ message: "Order can only be cancelled while Pending" });
  }

  order.status = "Cancelled";
  await order.save();
  res.json(order);
});

export const updateOrderAddress = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Only the owner can update the address
  if (String(order.userId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (order.status === "Delivered" || order.status === "Cancelled") {
    return res.status(400).json({ message: "Cannot edit address for completed or cancelled orders" });
  }

  const { deliveryAddress } = req.body;
  if (!deliveryAddress || typeof deliveryAddress !== "string" || deliveryAddress.trim().length < 6) {
    return res.status(400).json({ message: "Please provide a valid delivery address (min 6 characters)" });
  }

  order.deliveryAddress = deliveryAddress.trim();
  await order.save();
  res.json(order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const isStaff = STAFF_ROLES.includes(req.user?.role);
  if (!isStaff) {
    return res.status(403).json({ message: "Forbidden. Only staff can delete orders." });
  }

  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({ message: "Order deleted successfully" });
});
