import { Router } from "express";
import {
  deleteFeedback,
  getAllFeedback,
  getMenuFeedback,
  getMyFeedback,
  submitFeedback
} from "../controllers/feedbackController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, allowRoles("CUSTOMER"), submitFeedback);
router.get("/me", protect, allowRoles("CUSTOMER"), getMyFeedback);
router.get("/", protect, allowRoles("ADMIN", "FEEDBACK_MANAGER"), getAllFeedback);
router.get("/:menuItemId", getMenuFeedback);
router.delete("/:id", protect, allowRoles("ADMIN", "FEEDBACK_MANAGER"), deleteFeedback);

export default router;
