import express from "express";
import { fetchUserMiddleware } from "../middlewares/auth.middleware.js";
import {
  fetchAllUsers,
  checkAuth,
  updateUserDetails,
  signup,
  signin,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user", fetchUserMiddleware, checkAuth);
router.get("/verify/:email", resendVerificationEmail);
router.get("/:token", verifyEmail);
router.put("/", fetchUserMiddleware, updateUserDetails);
router.post("/", signup);
router.patch("/", signin);
router.get("/", fetchAllUsers);

export default router;
