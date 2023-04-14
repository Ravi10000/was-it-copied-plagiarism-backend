import express from "express";
import { fetchUserMiddleware } from "../middlewares/auth.middleware.js";
import {
  fetchAllUsers,
  checkAuth,
  updateUserDetails,
  signup,
  signin,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user", fetchUserMiddleware, checkAuth);
router.put("/", fetchUserMiddleware, updateUserDetails);
router.post("/", signup);
router.patch("/", signin);
router.get("/", fetchAllUsers);

export default router;
