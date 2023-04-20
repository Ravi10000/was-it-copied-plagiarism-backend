import express from "express";
import {
  fetchUserMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  fetchAllUsers,
  checkAuth,
  updateUserDetails,
  signup,
  signin,
  verifyEmail,
  resendVerificationEmail,
  fetchAllAdmins,
  createAdmin,
} from "../controllers/user.controller.js";

const router = express.Router();

router.put("/", fetchUserMiddleware, updateUserDetails);

router.post("/admins", fetchUserMiddleware, isAdminMiddleware, createAdmin);
router.post("/", signup);

router.patch("/", signin);

router.get("/user", fetchUserMiddleware, checkAuth);
router.get("/admins", fetchUserMiddleware, isAdminMiddleware, fetchAllAdmins);
router.get("/verify/:email", resendVerificationEmail);
router.get("/:token", verifyEmail);
router.get("/", fetchUserMiddleware, isAdminMiddleware, fetchAllUsers);

export default router;
