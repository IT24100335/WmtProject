import { Router } from "express";
import {
  createPromotion,
  deletePromotion,
  getAllPromotions,
  updatePromotion,
  validatePromotion
} from "../controllers/promotionController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/validate/:code", validatePromotion);
router.get("/", protect, allowRoles("ADMIN", "PROMOTION_MANAGER"), getAllPromotions);
router.post("/", protect, allowRoles("ADMIN", "PROMOTION_MANAGER"), createPromotion);
router.put("/:id", protect, allowRoles("ADMIN", "PROMOTION_MANAGER"), updatePromotion);
router.delete("/:id", protect, allowRoles("ADMIN", "PROMOTION_MANAGER"), deletePromotion);

export default router;
