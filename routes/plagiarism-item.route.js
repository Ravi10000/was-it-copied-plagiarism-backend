import express from "express";
import upload from "../middlewares/upload.middleware.js";
import {
  fetchAllTypes,
  editType,
  deleteType,
  createType,
} from "../controllers/plagiarism-item.controller.js";

const router = express.Router();

router.post("/", upload.single("icon"), createType);
router.put("/:id", upload.single("icon"), editType);

router.delete("/:id", deleteType);
router.get("/", fetchAllTypes);

export default router;
