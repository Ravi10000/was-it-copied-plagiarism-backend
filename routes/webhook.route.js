import express from "express";
import {
  completedScanWebhook,
  errorScanWebhook,
} from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/completed/:scanId", completedScanWebhook);
router.post("/error/:scanId", errorScanWebhook);
router.post("/creditsChecked/:scanId", completedScanWebhook);

export default router;
