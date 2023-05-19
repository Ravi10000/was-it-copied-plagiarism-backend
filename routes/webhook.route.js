import express from "express";
import { completedWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/completed/:scanId", completedWebhook);
router.post("/error/:scanId", completedWebhook);
router.post("/creditsChecked/:scanId", completedWebhook);
router.post("/indexed/:scanId", completedWebhook);

export default router;
