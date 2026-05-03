import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  updateOrderAddress,
  deleteOrder
} from "../controllers/orderController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getAllOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, allowRoles("CUSTOMER"), createOrder);
router.put("/:id/status", protect, allowRoles("ADMIN", "ORDER_MANAGER"), updateOrderStatus);
router.put("/:id/cancel", protect, allowRoles("CUSTOMER"), cancelOrder);
router.put("/:id/address", protect, allowRoles("CUSTOMER"), updateOrderAddress);
router.delete("/:id", protect, allowRoles("ADMIN", "ORDER_MANAGER"), deleteOrder);

export default router;
