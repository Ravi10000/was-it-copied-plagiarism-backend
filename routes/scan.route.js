import express from "express";
import {
  createScanFromFile,
  createScanFromText,
  getAllScans,
  getCredits,
  getMyScans,
  getScanById,
  getUsageHistory,
} from "../controllers/scan.controller.js";
import upload, { scanUpload } from "../middlewares/upload.middleware.js";
import {
  fetchUserMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth.middleware.js";
import { generateAccessToken } from "../middlewares/generateAccessToken.js";

const router = express.Router();

// router.post("/", upload.single("file"), checkPlagiarism);
router.post(
  "/text",
  fetchUserMiddleware,
  generateAccessToken,
  createScanFromText
);
router.post(
  "/file",
  scanUpload.single("file"),
  fetchUserMiddleware,
  generateAccessToken,
  createScanFromFile
);
router.get("/", fetchUserMiddleware, getMyScans);
router.get(
  "/credits",
  fetchUserMiddleware,
  isAdminMiddleware,
  generateAccessToken,
  getCredits
);
router.get(
  "/history",
  fetchUserMiddleware,
  isAdminMiddleware,
  generateAccessToken,
  getUsageHistory
);
router.get("/all", fetchUserMiddleware, isAdminMiddleware, getAllScans);
router.get("/:id", fetchUserMiddleware, getScanById);

export default router;
