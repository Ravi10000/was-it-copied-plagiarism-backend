import express from "express";
import {
  createBenefit,
  deleteBenefit,
  editBenefit,
  fetchAllBenefits,
} from "../controllers/benefit.controller.js";
import { fetchUserMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", fetchAllBenefits);

router.post("/", upload.single("icon"), fetchUserMiddleware, createBenefit);
router.put("/:id", upload.single("icon"), fetchUserMiddleware, editBenefit);
router.delete("/:id", fetchUserMiddleware, deleteBenefit);

export default router;
