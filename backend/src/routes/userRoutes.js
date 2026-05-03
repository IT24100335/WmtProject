import { Router } from "express";
import {
  createUser,
  deleteUser,
  getCurrentUser,
  getAllUsers,
  getUserProfile,
  updateUser
} from "../controllers/userController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", protect, getCurrentUser);
router.get("/", protect, allowRoles("ADMIN"), getAllUsers);
router.post("/", protect, allowRoles("ADMIN"), createUser);
router.get("/profile/:id", protect, getUserProfile);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, allowRoles("ADMIN"), deleteUser);

export default router;
