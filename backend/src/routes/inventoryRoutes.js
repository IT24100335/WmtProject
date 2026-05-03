import { Router } from "express";
import {
  createPantryItem,
  deletePantryItem,
  getPantryItems,
  updateMenuStock,
  updatePantryItem
} from "../controllers/inventoryController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/pantry", protect, allowRoles("ADMIN", "INVENTORY_MANAGER"), getPantryItems);
router.post("/pantry", protect, allowRoles("ADMIN", "INVENTORY_MANAGER"), createPantryItem);
router.put(
  "/pantry/:id",
  protect,
  allowRoles("ADMIN", "INVENTORY_MANAGER"),
  updatePantryItem
);
router.delete(
  "/pantry/:id",
  protect,
  allowRoles("ADMIN", "INVENTORY_MANAGER"),
  deletePantryItem
);
router.put("/:id/stock", protect, allowRoles("ADMIN", "INVENTORY_MANAGER"), updateMenuStock);

export default router;
