import express from "express";
import {
  fetchFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faq.controller.js";
import { fetchUserMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", fetchFaqs);

router.post("/", fetchUserMiddleware, createFaq);
router.put("/:id", fetchUserMiddleware, updateFaq);
router.delete("/:id", fetchUserMiddleware, deleteFaq);

export default router;
