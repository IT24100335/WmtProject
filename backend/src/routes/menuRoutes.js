import { Router } from "express";
import {
  deleteMenuItem,
  getAllMenuItems,
  getRecommendedMenuItems,
  saveMenuItem,
  toggleAvailability
} from "../controllers/menuController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = Router();

router.get("/", getAllMenuItems);
router.get("/recommended", getRecommendedMenuItems);
router.post(
  "/",
  protect,
  allowRoles("ADMIN", "MENU_MANAGER"),
  upload.single("imageFile"),
  saveMenuItem
);
router.put(
  "/:id/toggle-availability",
  protect,
  allowRoles("ADMIN", "MENU_MANAGER"),
  toggleAvailability
);
router.delete("/:id", protect, allowRoles("ADMIN", "MENU_MANAGER"), deleteMenuItem);

export default router;
