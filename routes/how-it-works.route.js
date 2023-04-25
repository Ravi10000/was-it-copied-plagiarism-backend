import express from "express";
import {
  fetchUserMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  createHowItWorksItem,
  fetchHowItWorks,
  updateHowItWorksItem,
} from "../controllers/how-it-works.controller.js";
import upload from "../middlewares/upload.middleware.js";
const router = express.Router();

router.get("/", fetchHowItWorks);
router.post("/", upload.single("image"), createHowItWorksItem);
router.put("/:id", upload.single("image"), updateHowItWorksItem);
export default router;
