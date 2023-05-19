import express from "express";
import { checkPlagiarism } from "../controllers/scan.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { fetchUserMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.post("/", upload.single("file"), checkPlagiarism);
router.post("/text", fetchUserMiddleware, checkPlagiarism);

export default router;
